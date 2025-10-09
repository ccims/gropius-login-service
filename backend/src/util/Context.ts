import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { OAuthAuthorizeRequest } from "../api-oauth/OAuthAuthorizeServerState";
import * as crypto from "crypto";
import { compareTimeSafe, MONTH_IN_SECONDS, now, TEN_MINUTES_IN_SECONDS } from "./utils";
import { FlowType } from "../strategies/AuthResult";
import { ActiveLogin } from "../model/postgres/ActiveLogin.entity";
import { Strategy } from "../strategies/Strategy";
import { LoginUser } from "../model/postgres/LoginUser.entity";

declare global {
    namespace Express {
        export interface Request {
            context: Context;
        }
    }
}

type RequestWithContext = Request & { session: ContextSession };

/**
 * This data is stored in the session, i.e., in the cookie.
 */
export type ContextSession = {
    // session id
    session_id: string;

    // issued at
    issued_at: number;

    // expires at
    expires_at: number;

    // user id
    user_id?: string;

    // active login id
    active_login_id?: string;

    // consent fingerprints of consented oauth authorization request
    consents: string[];

    // csrf token
    csrf: string;

    // flow
    flow?: {
        // flow id
        flow_id: string;

        // issued at
        issued_at: number;

        // TODO: implement this
        // expires at
        expires_at: number;

        // strategy type
        strategy_type?: string;

        // flow type
        flow_type?: FlowType;

        // TODO: implement this
        // active login id
        active_login_id?: string;

        // oauth authorization request
        oauth_request?: OAuthAuthorizeRequest;

        // current step in the flow process (the steps are sequential as given and might be restarted from "started" any time)
        step?: "started" | "authenticated" | "prompted";

        // TODO: 2nd process model for registration
    };
};

/**
 * Persistent session-based authentication used, e.g., for permission prompts and silent authentication.
 * Session data is exposed to the client and MUST NOT contain sensitive information.
 * This session data MUST ONLY be used for an OAuth flow and not, e.g., to authenticate a user against a resource server.
 */
export class Context {
    private readonly req: RequestWithContext;

    auth: Auth;
    flow: Flow;

    constructor(req: Request) {
        this.req = req as RequestWithContext;
        this.init();
    }

    drop() {
        // @ts-ignore
        this.req.session = {};
        this.init();
        return this;
    }

    private init() {
        this.auth = new Auth(this, this.req);
        this.flow = new Flow(this, this.req);
        this.auth.init();
    }
}

class Auth {
    constructor(
        private readonly context: Context,
        private readonly req: RequestWithContext,
    ) {}

    init() {
        if (!this.req.session) throw new Error("Session is missing");
        if (this.req.session.isPopulated) return this;

        const iat = now();
        this.req.session = {
            session_id: uuidv4(),
            csrf: uuidv4(),
            issued_at: iat,
            expires_at: iat + MONTH_IN_SECONDS,
            consents: [],
        };
        return this;
    }

    extend() {
        if (this.req.session.expires_at !== this.req.session.issued_at + MONTH_IN_SECONDS) {
            this.req.session.expires_at += MONTH_IN_SECONDS;
        }
    }

    isAuthenticated() {
        return !!this.req.session.user_id;
    }

    isExpired() {
        return now() > this.req.session.expires_at;
    }

    getUserId() {
        const user = this.req.session.user_id;
        if (!user) throw new Error("User id is missing");
        return user;
    }

    setUser(user: LoginUser) {
        this.req.session.user_id = user.id;
    }

    tryActiveLoginId() {
        return this.req.session.active_login_id;
    }

    getActiveLoginId() {
        const activeLogin = this.tryActiveLoginId();
        if (!activeLogin) throw new Error("Active login id is missing");
        return activeLogin;
    }

    setActiveLogin(activeLogin: ActiveLogin) {
        this.req.session.active_login_id = activeLogin.id;
    }

    getCSRF() {
        const CSRF = this.req.session.csrf;
        if (!CSRF) throw new Error("CSRF token is missing");
        return CSRF;
    }
}

// TODO: guard that flow is defined?!

class Flow {
    constructor(
        private readonly context: Context,
        private readonly req: RequestWithContext,
    ) {}

    exists() {
        return !!this.req.session.flow?.flow_id;
    }

    init() {
        this.context.auth.extend();

        const iat = now();
        this.req.session.flow = {
            flow_id: uuidv4(),
            issued_at: iat,
            expires_at: iat + TEN_MINUTES_IN_SECONDS,
            step: "started",
            // TODO: hotfix
            oauth_request: this.tryRequest(),
        };
    }

    drop() {
        this.req.session.flow = undefined;
    }

    getId() {
        const flow = this.req.session.flow?.flow_id;
        if (!flow) throw new Error("Flow id is missing");
        return flow;
    }

    isExpired() {
        return now() > this.req.session.flow.expires_at;
    }

    tryRequest() {
        return this.req.session.flow?.oauth_request;
    }

    setRequest(request: OAuthAuthorizeRequest) {
        this.req.session.flow.oauth_request = request;
        return this;
    }

    getRequest() {
        const request = this.tryRequest();
        if (!request) throw new Error("Authorization request is missing");
        return request;
    }

    isRegisterAdditional() {
        return this.tryType() === FlowType.REGISTER && this.context.auth.isAuthenticated();
    }

    tryStrategyTypeName() {
        return this.req.session.flow?.strategy_type;
    }

    getStrategyTypeName() {
        const name = this.tryStrategyTypeName();
        if (!name) throw new Error("Strategy type name is missing");
        return name;
    }

    setStrategy(strategy: Strategy) {
        this.req.session.flow.strategy_type = strategy.typeName;
    }

    // TODO: rework his
    // TODO: req workaround (userId must be string)
    // TODO: setActiveLoginId and setStrategy should only be called from setAuthenticated?
    setAuthenticated(data: { csrf: string }) {
        if (this.req.session.flow.step !== "started") {
            // TODO: throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        if (!compareTimeSafe(data.csrf, this.context.auth.getCSRF())) {
            // TODO: throw new OAuthHttpException("invalid_request", "Another external flow is currently running");
        }

        this.req.session.flow.step = "authenticated";

        // TODO: clean up data

        return this;
    }

    // TODO: rework his
    setPrompted(consent: boolean, flow: string) {
        if (this.req.session.flow.step !== "authenticated") {
            // TODO: throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        if (flow !== this.req.session.flow.flow_id) {
            // TODO: throw new OAuthHttpException("invalid_request", "Another flow is currently running");
        }

        if (consent) {
            const fingerprint = this.consentFingerprint();
            if (!this.req.session.consents.includes(fingerprint)) {
                this.req.session.consents.push(fingerprint);
            }
        }

        this.req.session.flow.step = "prompted";
        return this;
    }

    // TODO: rework his
    setFinished(flow: string) {
        if (this.req.session.flow.step !== "prompted") {
            // TODO: throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        if (flow !== this.req.session.flow.flow_id) {
            // TODO: throw new OAuthHttpException("invalid_request", "Another flow is currently running");
        }

        this.drop();

        return this;
    }

    tryType() {
        return this.req.session.flow?.flow_type;
    }

    getFlowType() {
        const type = this.tryType();
        if (!type) throw new Error("FlowType missing");
        return type;
    }

    setType(type: FlowType) {
        this.req.session.flow.flow_type = type;
        return this;
    }

    didConsent() {
        return this.req.session.consents.includes(this.consentFingerprint());
    }

    consentFingerprint() {
        const request = this.getRequest();

        const data = JSON.stringify({
            clientId: request.clientId,
            scope: request.scope,
            redirect: request.redirect,
        });

        return crypto.createHash("sha256").update(data).digest("base64url");
    }
}

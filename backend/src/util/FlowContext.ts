import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { OAuthAuthorizeRequest } from "../api-oauth/OAuthAuthorizeServerState";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import * as crypto from "crypto";
import { MONTH_IN_SECONDS, now } from "./utils";
import { FlowType } from "../strategies/AuthResult";
import { ActiveLogin } from "../model/postgres/ActiveLogin.entity";
import { AuthClient } from "../model/postgres/AuthClient.entity";
import { TokenScope } from "../backend-services/token.service";
import { Strategy } from "../strategies/Strategy";

declare global {
    namespace Express {
        export interface Request {
            context: FlowContext;
        }
    }
}

type RequestWithContext = Request & { session: FlowSession };

/**
 * This data is stored in the session, i.e., in the cookie.
 */
export type FlowSession = {
    // session id
    sid: string;

    // issued at
    iat: number;

    // expires at
    exp: number;

    // user id
    user_id?: string;

    // active login id
    active_login_id?: string;

    // TODO: only required for reg
    // strategy type
    strategy_type?: string;

    // flow type
    flow_type?: FlowType;

    // flow id (used to bind the whole interaction)
    flow_id?: string;

    // internal csrf token
    csrf?: string;

    // external csrf token (used to bind the whole interaction also with external parties)
    csrf_ext?: string;

    // oauth authorization request
    oauth_request?: OAuthAuthorizeRequest;

    // consent fingerprints of consented oauth authorization request
    consents: string[];

    // current step in the flow process (the steps are sequential as given and might be restarted from "started" any time)
    step: "init" | "started" | "authenticated" | "prompted" | "finished";

    // TODO: get rid of this
    // second token
    second_token?: boolean;
};

// TODO: also load user?

/**
 * Entities that are loaded from the database
 */
export type FlowLoaded = {
    activeLogin?: ActiveLogin;
    client?: AuthClient;
    strategy?: Strategy;
};

/**
 * Persistent session-based authentication used, e.g., for permission prompts and silent authentication.
 * Session data is exposed to the client and MUST NOT contain sensitive information.
 * This session data MUST ONLY be used for an OAuth flow and not, e.g., to authenticate a user against a resource server.
 */
export class FlowContext {
    private readonly req: RequestWithContext;

    loaded: FlowLoaded = {};

    constructor(req: Request) {
        this.req = req as RequestWithContext;
    }

    init() {
        if (!this.req.session) throw new Error("Session is missing");
        if (this.req.session.isPopulated) return this;

        const iat = now();
        this.req.session = {
            sid: uuidv4(),
            iat,
            exp: iat + MONTH_IN_SECONDS,
            step: "init",
            consents: [],
        };
        return this;
    }

    isAuthenticated() {
        return !!this.req.session.user_id;
    }

    isExpired() {
        return now() > this.req.session.exp;
    }

    drop() {
        // @ts-ignore
        this.req.session = null;
        return this;
    }

    regenerate() {
        this.drop();
        this.init();
    }

    tryRequest() {
        return this.req.session.oauth_request;
    }

    setRequest(request: OAuthAuthorizeRequest) {
        this.req.session.oauth_request = request;
        return this;
    }

    getRequest() {
        const request = this.tryRequest();
        if (!request) {
            throw new OAuthHttpException("invalid_request", "Authorization request is missing");
        }

        return request;
    }

    isRegisterAdditional() {
        return this.getRequest().scope.includes(TokenScope.LOGIN_SERVICE_REGISTER);
    }

    getUserId() {
        const user = this.req.session.user_id;
        if (!user) {
            throw new OAuthHttpException("invalid_request", "User id is missing");
        }
        return user;
    }

    tryActiveLoginId() {
        return this.req.session.active_login_id;
    }

    getActiveLoginId() {
        const activeLogin = this.tryActiveLoginId();
        if (!activeLogin) {
            throw new OAuthHttpException("invalid_request", "Active login id is missing");
        }
        return activeLogin;
    }

    tryActiveLogin() {
        return this.loaded.activeLogin;
    }

    getActiveLogin() {
        const login = this.tryActiveLogin();
        if (!login) {
            throw new OAuthHttpException("invalid_request", "Active login is missing");
        }
        return login;
    }

    setActiveLogin(activeLogin: ActiveLogin) {
        this.req.session.active_login_id = activeLogin.id;
        this.loaded.activeLogin = activeLogin;
    }

    getFlowId() {
        const flow = this.req.session.flow_id;
        if (!flow) {
            throw new OAuthHttpException("invalid_request", "Flow id is missing");
        }
        return flow;
    }

    getCSRF() {
        const CSRF = this.req.session.csrf;
        if (!CSRF) {
            throw new OAuthHttpException("invalid_request", "CSRF token is missing");
        }
        return CSRF;
    }

    getExternalCSRF() {
        const externalCSRF = this.req.session.csrf_ext;
        if (!externalCSRF) {
            throw new OAuthHttpException("invalid_request", "External CSRF token is missing");
        }
        return externalCSRF;
    }

    tryStrategyTypeName() {
        return this.req.session.strategy_type;
    }

    tryStrategy() {
        return this.loaded.strategy;
    }

    setStrategy(name: string, strategy: Strategy) {
        this.req.session.strategy_type = name;
        this.loaded.strategy = strategy;
    }

    getStrategy() {
        const strategy = this.tryStrategy();
        if (!strategy) throw new OAuthHttpException("invalid_request", "Strategy missing");
        return strategy;
    }

    setStarted() {
        this.init();

        if (this.req.session.exp !== this.req.session.iat + MONTH_IN_SECONDS) {
            this.req.session.exp += MONTH_IN_SECONDS;
        }
        this.req.session.flow_id = uuidv4();
        this.req.session.csrf = uuidv4();
        this.req.session.csrf_ext = uuidv4();
        this.req.session.step = "started";
        return this;
    }

    // TODO: req workaround (userId must be string)
    // TODO: setActiveLoginId and setStrategy should only be called from setAuthenticated?
    setAuthenticated(data: { userId?: string; externalCSRF: string }) {
        // TODO: reg workaround
        const no = false;
        if (this.req.session.step !== "started" && no) {
            throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong");
        }

        if (data.externalCSRF !== this.getExternalCSRF() && no) {
            throw new OAuthHttpException("invalid_request", "Another external flow is currently running");
        }

        this.req.session.user_id = data.userId;
        this.req.session.step = "authenticated";

        // TODO: reg workaround
        // TODO: delete this.req.session.csrf_ext;

        return this;
    }

    setPrompted(consent: boolean, flow: string) {
        if (this.req.session.step !== "authenticated") {
            throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        if (flow !== this.req.session.flow_id) {
            throw new OAuthHttpException("invalid_request", "Another flow is currently running");
        }

        if (consent) {
            const fingerprint = this.consentFingerprint();
            if (!this.req.session.consents.includes(fingerprint)) {
                this.req.session.consents.push(fingerprint);
            }
        }

        this.req.session.step = "prompted";
        return this;
    }

    setFinished(flow: string) {
        if (this.req.session.step !== "prompted") {
            throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        if (flow !== this.req.session.flow_id) {
            throw new OAuthHttpException("invalid_request", "Another flow is currently running");
        }

        this.req.session.step = "finished";

        // TODO: delete this.req.session.flow;
        // TODO: delete this.req.session.req;

        return this;
    }

    didConsent() {
        return this.req.session.consents.includes(this.consentFingerprint());
    }

    consentFingerprint() {
        if (!this.req.session.oauth_request) {
            throw new OAuthHttpException("invalid_request", "Authorization request is missing");
        }

        const data = JSON.stringify({
            clientId: this.req.session.oauth_request.clientId,
            scope: this.req.session.oauth_request.scope,
            redirect: this.req.session.oauth_request.redirect,
        });

        return crypto.createHash("sha256").update(data).digest("base64url");
    }

    tryClient() {
        return this.loaded.client;
    }

    getClient() {
        const client = this.tryClient();
        if (!client) throw new OAuthHttpException("invalid_request", "Client missing");
        return client;
    }

    setClient(client: AuthClient) {
        this.loaded.client = client;
    }

    getSecondToken() {
        return this.req.session.second_token;
    }

    setSecondToken(value: boolean) {
        this.req.session.second_token = value;
    }

    tryFlowType() {
        return this.req.session.flow_type;
    }

    getFlowType() {
        const type = this.tryFlowType();
        if (!type) throw new OAuthHttpException("invalid_request", "FlowType missing");
        return type;
    }

    setFlowType(type: FlowType) {
        this.req.session.flow_type = type;
        return this;
    }
}

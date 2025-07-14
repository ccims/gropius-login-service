import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { OAuthAuthorizeRequest } from "../api-oauth/OAuthAuthorizeServerState";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import * as crypto from "crypto";
import { MONTH_IN_SECONDS, now } from "./utils";

type RequestWithSession = Request & { session: FlowSessionData };

/**
 * This data is stored in the session, i.e., in the cookie.
 */
export type FlowSessionData = {
    // session id
    sid: string;

    // issued at
    iat: number;

    // expires at
    exp: number;

    // user id
    usr?: string;

    // active login id
    active_login?: string;

    // flow id (used to bind the whole interaction)
    flow?: string;

    // internal csrf token
    csrf?: string;

    // external csrf token (used to bind the whole interaction also with external parties)
    csrf_ext?: string;

    // oauth authorization request
    req?: OAuthAuthorizeRequest;

    // consent fingerprints of consented oauth authorization request
    consents: string[];

    // current step in the flow process (the steps are sequential as given and might be restarted from "started" any time)
    step: "init" | "started" | "authenticated" | "prompted" | "finished";
};

/**
 * Persistent session-based authentication used, e.g., for permission prompts and silent authentication.
 * Session data is exposed to the client and MUST NOT contain sensitive information.
 * This session data MUST ONLY be used for an OAuth flow and not, e.g., to authenticate a user against a resource server.
 */
export class FlowSession {
    private readonly req: RequestWithSession;

    middlewares: {
        restore: boolean;
        prompt: boolean;
        code: boolean;
    } = { restore: true, prompt: true, code: true };

    constructor(req: Request) {
        this.req = req as RequestWithSession;
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
        return !!this.req.session.usr;
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
        return this.req.session.req;
    }

    getRequest() {
        const request = this.tryRequest();
        if (!request) {
            throw new OAuthHttpException("invalid_request", "Authorization request is missing");
        }

        return request;
    }

    getUserId() {
        const user = this.req.session.usr;
        if (!user) {
            throw new OAuthHttpException("invalid_request", "User id is missing");
        }
        return user;
    }

    tryActiveLogin() {
        return this.req.session.active_login;
    }

    getActiveLogin() {
        const activeLogin = this.tryActiveLogin();
        if (!activeLogin) {
            throw new OAuthHttpException("invalid_request", "Active login id is missing");
        }
        return activeLogin;
    }

    getFlowId() {
        const flow = this.req.session.flow;
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

    setStarted(request: OAuthAuthorizeRequest) {
        this.init();

        if (this.req.session.exp !== this.req.session.iat + MONTH_IN_SECONDS) {
            this.req.session.exp += MONTH_IN_SECONDS;
        }
        this.req.session.flow = uuidv4();
        this.req.session.csrf = uuidv4();
        this.req.session.csrf_ext = uuidv4();
        this.req.session.req = request;
        this.req.session.step = "started";
        return this;
    }

    setAuthenticated(userId: string, activeLoginId: string, externalCSRF: string) {
        if (this.req.session.step !== "started") {
            throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong");
        }

        if (externalCSRF !== this.getExternalCSRF()) {
            throw new OAuthHttpException("invalid_request", "Another external flow is currently running");
        }

        this.req.session.usr = userId;
        this.req.session.active_login = activeLoginId;
        this.req.session.step = "authenticated";

        delete this.req.session.csrf_ext;

        return this;
    }

    setPrompted(consent: boolean, flow: string) {
        if (this.req.session.step !== "authenticated") {
            throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        if (flow !== this.req.session.flow) {
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

    skipPrompt() {
        this.setPrompted(true, this.getFlowId());
        this.setFinished(this.getFlowId());
        return this;
    }

    setFinished(flow: string) {
        if (this.req.session.step !== "prompted") {
            throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        if (flow !== this.req.session.flow) {
            throw new OAuthHttpException("invalid_request", "Another flow is currently running");
        }

        this.req.session.step = "finished";

        delete this.req.session.flow;
        delete this.req.session.req;

        return this;
    }

    didConsent() {
        return this.req.session.consents.includes(this.consentFingerprint());
    }

    consentFingerprint() {
        if (!this.req.session.req) {
            throw new OAuthHttpException("invalid_request", "Authorization request is missing");
        }

        const data = JSON.stringify({
            clientId: this.req.session.req.clientId,
            scope: this.req.session.req.scope,
            redirect: this.req.session.req.redirect,
        });

        return crypto.createHash("sha256").update(data).digest("base64url");
    }
}

declare global {
    namespace Express {
        export interface Request {
            flow: FlowSession;
        }
    }
}

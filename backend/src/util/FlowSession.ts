import { NextFunction, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { OAuthAuthorizeRequest } from "../api-oauth/OAuthAuthorizeServerState";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import * as crypto from "crypto";

type RequestWithSession = Request & { session?: FlowSessionData };

export type FlowSessionData = {
    // session id
    id: string;

    // issued at
    iat: number;

    // expires at
    exp: number;

    // user id
    user?: string;

    // active login id
    // TODO: is this confidential?
    activeLogin?: string;

    // flow id (used to bind the whole interaction)
    flow?: string;

    // oauth authorization request
    request?: OAuthAuthorizeRequest;

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

    constructor(req: Request) {
        this.req = req as RequestWithSession;
    }

    init() {
        if (this.req.session?.isPopulated) return this;
        const iat = now();
        this.req.session = {
            id: uuidv4(),
            iat,
            exp: iat + MONTH_IN_SECONDS,
            step: "init",
            consents: [],
        };
    }

    isAuthenticated() {
        return !!this.req.session.user;
    }

    isValid() {
        // Expired
        if (now() > this.req.session.exp) {
            console.log(this.req.session, now(), this.req.session.exp);
            return false;
        }

        // Revoked
        // TODO: check if revoked

        return true;
    }

    drop() {
        this.req.session = null;
        return this;
    }

    regenerate() {
        this.drop();
        this.init();
    }

    setStarted(request: OAuthAuthorizeRequest) {
        this.init();

        if (this.req.session.exp !== this.req.session.iat + MONTH_IN_SECONDS) {
            this.req.session.exp += MONTH_IN_SECONDS;
        }
        this.req.session.flow = uuidv4();
        this.req.session.request = request;
        this.req.session.step = "started";
        return this;
    }

    getRequest() {
        if (!this.req.session.request) {
            throw new OAuthHttpException("invalid_request", "Authorization request is missing");
        }

        return this.req.session!.request;
    }

    getUser() {
        const user = this.req.session.user;
        if (!user) {
            throw new OAuthHttpException("invalid_request", "User id is missing");
        }
        return user;
    }

    getActiveLogin() {
        const activeLogin = this.req.session.activeLogin;
        if (!activeLogin) {
            throw new OAuthHttpException("invalid_request", "Active login id is missing");
        }
        return activeLogin;
    }

    getFlow() {
        const flow = this.req.session.flow;
        if (!flow) {
            throw new OAuthHttpException("invalid_request", "Flow id is missing");
        }
        return flow;
    }

    setAuthenticated(userId: string, activeLoginId: string) {
        if (this.req.session.step !== "started") {
            throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        this.req.session.user = userId;
        this.req.session.activeLogin = activeLoginId;
        this.req.session.step = "authenticated";

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
        this.setPrompted(true, this.getFlow());
        this.setFinished(this.getFlow());
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
        delete this.req.session.request;
        delete this.req.session.activeLogin;
        return this;
    }

    didConsent() {
        return this.req.session.consents.includes(this.consentFingerprint());
    }

    consentFingerprint() {
        if (!this.req.session.request) {
            throw new OAuthHttpException("invalid_request", "Authorization request is missing");
        }

        const data = JSON.stringify({
            clientId: this.req.session.request.clientId,
            scope: this.req.session.request.scope,
            redirect: this.req.session.request.redirect,
        });

        return crypto.createHash("sha256").update(data).digest("base64url");
    }
}

const MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

function now() {
    return Math.floor(Date.now() / 1000);
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    req.flow = new FlowSession(req);
    req.flow.init();
    if (!req.flow.isValid()) req.flow.regenerate();
    next();
}

declare global {
    namespace Express {
        export interface Request {
            flow?: FlowSession;
        }
    }
}

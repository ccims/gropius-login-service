import { NextFunction, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { OAuthAuthorizeRequest } from "../api-oauth/OAuthAuthorizeServerState";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";

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

    // flow
    flow?: string;

    // oauth authorization request
    request?: OAuthAuthorizeRequest;

    // current step in the flow process
    // TODO: register?
    step: "init" | "started" | "authenticated" | "prompted";
};

// TODO: session can be undefined?!

/**
 * Persistent session-based authentication used, e.g., for permission prompts and silent authentication.
 * Session data is exposed to the client and MUST NOT contain sensitive information.
 * This session data MUST ONLY be used for an OAuth flow and not, e.g., to authenticate a user against a resource server.
 */
export class FlowSession {
    private readonly req: RequestWithSession;

    constructor(req: Request) {
        this.req = req as RequestWithSession;
        this.init();
    }

    init() {
        if (this.req.session) return this;
        const iat = now();
        this.req.session = {
            id: uuidv4(),
            iat,
            exp: iat + MONTH_DAYS_IN_SECONDS,
            step: "init",
        };
    }

    isAuthenticated() {
        return !!this.req.session.user;
    }

    isValid() {
        // Not initialized
        if (!this.req.session) return false;

        // Expired
        if (now() > this.req.session.exp) return false;

        // Revoked
        // TODO: check if revoked

        return true;
    }

    drop() {
        // TODO: why do we drop it?!
        console.log("would have dropped");
        // this.req.session = null;
        return this;
    }

    setStarted(request: OAuthAuthorizeRequest) {
        this.init();

        if (this.req.session.exp !== this.req.session.iat + MONTH_DAYS_IN_SECONDS) {
            this.req.session.exp += MONTH_DAYS_IN_SECONDS;
        }
        this.req.session.flow = uuidv4();
        this.req.session.request = request;
        this.req.session.step = "started";
        return this;
    }

    getRequest() {
        const request = this.req.session?.request;
        if (!request) {
            throw new OAuthHttpException("invalid_request", "Authorization request is missing");
        }

        return this.req.session.request;
    }

    getUser() {
        const user = this.req.session.user;
        if (!user) {
            throw new OAuthHttpException("invalid_request", "User id is missing");
        }
        return user;
    }

    getFlow() {
        const flow = this.req.session.flow;
        if (!flow) {
            throw new OAuthHttpException("invalid_request", "Flow id is missing");
        }
        return flow;
    }

    setAuthenticated(userId: string) {
        if (this.req.session.step !== "started") {
            throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        this.req.session.user = userId;
        this.req.session.step = "authenticated";
        return this;
    }

    setPrompted(flow: string) {
        if (this.req.session.step !== "authenticated") {
            throw new OAuthHttpException("invalid_request", "Steps are executed in the wrong order");
        }

        if (flow !== this.req.session.flow) {
            throw new OAuthHttpException("invalid_request", "Another flow is currently running");
        }

        this.req.session.step = "prompted";
        return this;
    }
}

const MONTH_DAYS_IN_SECONDS = 30 * 60 * 30;

function now() {
    return Math.floor(Date.now() / 1000);
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    if (req.session) {
        req.flow = new FlowSession(req);
        if (!req.flow.isValid()) req.flow.drop();
    }
    next();
}

declare global {
    namespace Express {
        export interface Request {
            flow?: FlowSession;
        }
    }
}

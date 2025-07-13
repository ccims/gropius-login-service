import { NextFunction, Request, Response } from "express";
import { AuthStateServerData } from "../../strategies/AuthResult";
import { OAuthAuthorizeServerState } from "../../api-oauth/OAuthAuthorizeServerState";
import { Strategy } from "../../strategies/Strategy";
import { OAuthHttpException } from "../../api-oauth/OAuthHttpException";

declare global {
    namespace Express {
        export interface Request {
            internal: FlowInternal;
        }
    }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    // TODO: wtf is "(res.locals.state as ApiStateData)"?!
    if (!res.locals) {
        res.locals = {};
    }
    if (!res.locals.state) {
        res.locals.state = {};
    }

    if (!req.internal) req.internal = new FlowInternal();

    next();
}

export type FlowInternalData = Partial<
    AuthStateServerData &
        OAuthAuthorizeServerState & { strategy: Strategy } & { secondToken?: boolean } & {
            externalFlow?: string;
        }
>;

export class FlowInternal {
    readonly _internal: FlowInternalData = {};

    tryAuthState() {
        return this._internal.authState;
    }

    getAuthState() {
        const authState = this.tryAuthState();
        if (!authState) throw new OAuthHttpException("invalid_request", "AuthState missing");
        return authState;
    }

    getActiveLogin() {
        return this._internal.activeLogin;
    }

    tryRequest() {
        return this._internal.request;
    }

    getRequest() {
        const request = this.tryRequest();
        if (!request) throw new OAuthHttpException("invalid_request", "Request missing");
        return request;
    }

    tryIsRegisterAdditional() {
        return this._internal.isRegisterAdditional;
    }

    tryClient() {
        return this._internal.client;
    }

    getClient() {
        const client = this.tryClient();
        if (!client) throw new OAuthHttpException("invalid_request", "Client missing");
        return client;
    }

    getSecondToken() {
        return this._internal.secondToken;
    }

    getStrategy() {
        const strategy = this._internal.strategy;
        if (!strategy) throw new OAuthHttpException("invalid_request", "Strategy missing");
        return strategy;
    }

    getExternalFlow() {
        return this._internal.externalFlow;
    }

    append(data: FlowInternalData) {
        Object.assign(this._internal, data);
    }
}

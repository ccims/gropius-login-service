import { NextFunction, Request, Response } from "express";
import { AuthStateServerData } from "../strategies/AuthResult";
import { OAuthAuthorizeServerState } from "../api-oauth/OAuthAuthorizeServerState";
import { Strategy } from "../strategies/Strategy";

declare global {
    namespace Express {
        export interface Request {
            internal: FlowInternal;
        }
    }
}

// TODO: undefined thingies not highlighted in my ide ...

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

// TODO: which kind of error to throw?!

export class FlowInternal {
    // TODO: debug the use of _internal
    readonly _internal: FlowInternalData = {};

    getAuthState() {
        const authState = this._internal.authState;
        if (!authState) throw new Error("AuthState missing");
        return authState;
    }

    getActiveLogin() {
        return this._internal.activeLogin;
    }

    getRequest() {
        const request = this._internal.request;
        if (!request) throw new Error("Request missing");
        return request;
    }

    isRegisterAdditional() {
        return this._internal.isRegisterAdditional;
    }

    getClient() {
        const client = this._internal.client;
        if (!client) throw new Error("Client missing");
        return client;
    }

    getSecondToken() {
        return this._internal.secondToken;
    }

    getStrategy() {
        const strategy = this._internal.strategy;
        if (!strategy) throw new Error("strategy missing");
        return strategy;
    }

    getExternalFlow() {
        return this._internal.externalFlow;
    }

    append(data: FlowInternalData) {
        Object.assign(this._internal, data);
    }
}

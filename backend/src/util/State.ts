import { NextFunction, Response } from "express";
import { AuthStateServerData } from "../strategies/AuthResult";
import { OAuthAuthorizeServerState } from "../api-oauth/OAuthAuthorizeServerState";
import { Strategy } from "../strategies/Strategy";

// TODO: write all this into flowSession? or at least use req intead of res?

declare global {
    namespace Express {
        export interface Response {
            state: State;
            appendState: (state: State) => void;
        }
    }
}

// TODO: undefined thingies not highlighted in my ide ...

export type State = Partial<
    AuthStateServerData &
        OAuthAuthorizeServerState & { strategy: Strategy } & { secondToken?: boolean } & {
            externalFlow?: string;
        }
>;

export function middleware(req: Request, res: Response, next: NextFunction) {
    if (!res.state) res.state = {};

    // TODO: wtf is "(res.locals.state as ApiStateData)"?!
    if (!res.locals) {
        res.locals = {};
    }
    if (!res.locals.state) {
        res.locals.state = {};
    }

    if (!res.appendState) {
        res.appendState = (state: State) => {
            Object.assign(res.state, state);
        };
    }

    next();
}

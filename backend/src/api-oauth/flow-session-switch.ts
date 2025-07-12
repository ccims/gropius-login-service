import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { AuthStateServerData } from "../strategies/AuthResult";

@Injectable()
export class FlowSessionSwitchMiddleware extends StateMiddleware<
    AuthStateServerData & OAuthAuthorizeServerState,
    AuthStateServerData & OAuthAuthorizeServerState
> {
    constructor() {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: AuthStateServerData & OAuthAuthorizeServerState & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        // TODO: enable this
        const not = false;
        if (req.flow.isAuthenticated() && not) {
            req.flow.setStarted(state.request);
            req.flow.setAuthenticated(req.flow.getUser(), req.flow.getActiveLogin(), req.flow.getExternalFlow());
        } else {
            req.flow.middlewares.prompt = false;
            req.flow.middlewares.code = false;
            req.flow.middlewares.restore = false;
        }

        next();
    }
}

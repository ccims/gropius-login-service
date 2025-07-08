import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { AuthStateServerData } from "src/strategies/AuthResult";

@Injectable()
export class AuthFlowSetAuthenticatedMiddleware extends StateMiddleware<
    OAuthAuthorizeServerState & AuthStateServerData,
    OAuthAuthorizeServerState & AuthStateServerData
> {
    constructor() {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & AuthStateServerData & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const user = await (await state.activeLogin.loginInstanceFor).user;
        req.flow.setAuthenticated(user.id, state.activeLogin.id);
        next();
    }
}

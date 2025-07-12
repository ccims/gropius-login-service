import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { AuthStateServerData } from "src/strategies/AuthResult";

@Injectable()
export class FlowSessionSetAuthenticatedMiddleware extends StateMiddleware<
    OAuthAuthorizeServerState & AuthStateServerData,
    OAuthAuthorizeServerState & AuthStateServerData
> {
    constructor() {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & AuthStateServerData & { error?: any } & { externalFlow?: string },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        // TODO: remove log
        console.log(res.locals);

        const externalFlow = state.externalFlow;
        if (!externalFlow) throw new Error("External flow id is missing");

        const activeLogin = state.activeLogin;
        if (!activeLogin) throw new Error("Active login missing");

        const userLoginData = await activeLogin.loginInstanceFor;
        if (!userLoginData) throw new Error("User login data not found");

        const loginUser = await userLoginData.user;
        if (!loginUser) throw new Error("Login user not found");

        req.flow.setAuthenticated(loginUser.id, activeLogin.id, externalFlow);
        next();
    }
}

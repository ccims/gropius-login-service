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
        // TODO: remove logs
        console.log(res.locals);

        const userLoginData = await state.activeLogin.loginInstanceFor;
        console.log(userLoginData);
        if (!userLoginData) throw new Error("Did not find user login data");

        const loginUser = await userLoginData.user;
        console.log(loginUser);
        if (!loginUser) throw new Error("Did not find login user");

        req.flow.setAuthenticated(loginUser.id, state.activeLogin.id);
        next();
    }
}

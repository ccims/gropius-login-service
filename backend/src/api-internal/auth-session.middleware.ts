import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { AuthStateServerData } from "src/strategies/AuthResult";
import { Session } from "src/util/session";

@Injectable()
export class AuthSessionMiddleware extends StateMiddleware<
    OAuthAuthorizeServerState & AuthStateServerData,
    OAuthAuthorizeServerState & AuthStateServerData
> {
    constructor(
    ) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & AuthStateServerData & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const user = await ((await state.activeLogin.loginInstanceFor).user)
        const session = new Session(req)
        session.login(user.username)
        next();
    }
}

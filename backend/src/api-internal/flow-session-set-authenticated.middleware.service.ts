import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";

@Injectable()
export class FlowSessionSetAuthenticatedMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        // TODO: remove log
        console.log(res.locals);
        console.log(res.state);

        const externalFlow = res.state.externalFlow;
        if (!externalFlow) throw new OAuthHttpException("access_denied", "External flow id is missing");

        const activeLogin = res.state.activeLogin;
        if (!activeLogin) throw new OAuthHttpException("access_denied", "Active login missing");

        const userLoginData = await activeLogin.loginInstanceFor;
        if (!userLoginData) throw new OAuthHttpException("access_denied", "User login data not found");

        const loginUser = await userLoginData.user;
        if (!loginUser) throw new OAuthHttpException("access_denied", "Login user not found");

        req.flow.setAuthenticated(loginUser.id, activeLogin.id, externalFlow);
        next();
    }
}

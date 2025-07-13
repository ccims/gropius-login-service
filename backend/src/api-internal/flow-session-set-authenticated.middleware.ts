import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class FlowSessionSetAuthenticatedMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const externalFlow = req.internal.getExternalFlow();
        const activeLogin = req.internal.tryActiveLogin();
        const userLoginData = await activeLogin.loginInstanceFor;
        const loginUser = await userLoginData.user;
        req.flow.setAuthenticated(loginUser.id, activeLogin.id, externalFlow);
        next();
    }
}

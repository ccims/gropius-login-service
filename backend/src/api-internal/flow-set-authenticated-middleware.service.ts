import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

/**
 * TODO: reg workaround
 * During a registration, an activeLogin is created for userLoginData BUT NO user is created YET
 */

@Injectable()
export class FlowSetAuthenticatedMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const externalCSRF = req.context.getExternalCSRF();
        const activeLogin = req.context.tryActiveLogin();
        const userLoginData = await activeLogin.loginInstanceFor;
        const loginUser = await userLoginData.user;

        req.context.setAuthenticated({
            userId: loginUser?.id,
            externalCSRF,
        });
        next();
    }
}

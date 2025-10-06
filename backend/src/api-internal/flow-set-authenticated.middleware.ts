import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class FlowSetAuthenticatedMiddleware implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    async use(req: Request, res: Response, next: NextFunction) {
        const externalCSRF = req.context.getExternalCSRF();
        const activeLogin = req.context.tryActiveLogin();
        const userLoginData = await activeLogin.loginInstanceFor;
        const loginUser = await userLoginData.user;

        // TODO: if register-additional, then we need to keep track of already logged in user and newly registered user

        if (loginUser) req.context.setUser(loginUser);

        req.context.setAuthenticated({
            externalCSRF,
        });

        this.logger.log("User authenticated in flow context: " + loginUser?.id);
        next();
    }
}

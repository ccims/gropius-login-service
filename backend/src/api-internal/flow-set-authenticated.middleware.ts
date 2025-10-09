import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ActiveLoginService } from "../model/services/active-login.service";

@Injectable()
export class FlowSetAuthenticatedMiddleware implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly activeLoginService: ActiveLoginService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const csrf = req.context.auth.getCSRF();
        const activeLogin = await this.activeLoginService.findOneByOrFail({
            id: req.context.flow.getActiveLoginId(),
        });
        const userLoginData = await activeLogin.loginInstanceFor;
        const loginUser = await userLoginData.user;

        if (loginUser) req.context.auth.setUser(loginUser);

        this.logger.log("User authenticated in flow context: " + loginUser?.id);
        next();
    }
}

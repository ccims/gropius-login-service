import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { FlowSession } from "../util/FlowSession";
import { LoginUserService } from "../model/services/login-user.service";
import { now } from "../util/utils";

@Injectable()
export class FlowSessionInitMiddleware implements NestMiddleware {
    constructor(private readonly loginUserService: LoginUserService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Init flow session
        req.flow = new FlowSession(req);
        req.flow.init();

        // Check if expired
        if (req.flow.isExpired()) req.flow.regenerate();

        // Check if revoked
        if (req.flow.isAuthenticated()) {
            const loginUser = await this.loginUserService.findOneBy({ id: req.flow.getUserId() });
            if (!loginUser) throw new Error("Login user not found");

            const revokedAt = loginUser.revokeTokensBefore;
            if (revokedAt) {
                if (now() > revokedAt.getTime()) throw new Error("Login user revoked tokens");
            }
        }

        next();
    }
}

import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { Context } from "../util/Context";
import { LoginUserService } from "../model/services/login-user.service";
import { now } from "../util/utils";
import { ActiveLoginService } from "../model/services/active-login.service";
import { AuthClientService } from "../model/services/auth-client.service";

@Injectable()
export class FlowInitMiddleware implements NestMiddleware {
    constructor(
        private readonly loginUserService: LoginUserService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Init flow session
        req.context = new Context(req);

        // Check if auth expired
        if (req.context.auth.isExpired()) {
            console.log("auth expired ...");
            req.context.drop();
        }

        // Check if revoked
        if (req.context.auth.isAuthenticated()) {
            const loginUser = await this.loginUserService.findOneByOrFail({ id: req.context.auth.getUserId() });
            if (!loginUser) throw new Error("Login user not found");

            const revokedAt = loginUser.revokeTokensBefore;
            if (revokedAt) {
                if (now() > revokedAt.getTime()) throw new Error("Login user revoked tokens");
            }
        }

        // Check active login exists
        const activeLoginId = req.context.auth.tryActiveLoginId();
        if (activeLoginId) {
            const activeLogin = await this.activeLoginService.findOneByOrFail({
                id: req.context.auth.getActiveLoginId(),
            });

            // TODO: check if active login is valid and not expired

            // TODO: check if user data is valid and not expired
        }

        if (req.context.flow.exists()) {
            // Check if flow expired
            if (req.context.flow.isExpired()) {
                console.log("flow expired ...");
                req.context.flow.drop();
            }

            // Check client is valid
            const request = req.context.flow.tryRequest();
            if (request) {
                const client = await this.authClientService.findAuthClient(request.clientId);
                if (!client) throw new Error("Client not found");
                if (!client.isValid) throw new Error("Client invalid");
            }
        }

        next();
    }
}

import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { Context } from "../util/Context";
import { LoginUserService } from "../model/services/login-user.service";
import { now } from "../util/utils";
import { JwtService } from "@nestjs/jwt";
import { ActiveLoginService } from "../model/services/active-login.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { StrategiesService } from "../model/services/strategies.service";
import { OAuthAuthorizeRequest } from "./OAuthAuthorizeServerState";

@Injectable()
export class FlowInitMiddleware implements NestMiddleware {
    constructor(
        private readonly loginUserService: LoginUserService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
        private readonly strategiesService: StrategiesService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Init flow session
        req.context = new Context(req);
        req.context.init();

        // Check if expired
        if (req.context.isExpired()) {
            console.log("flow expired ...");
            req.context.regenerate();
        }

        // TODO: check if active login is valid and not expired

        // TODO: check if user data is valid and not expired

        // TODO: check if flow is expired

        // Check if revoked
        if (req.context.isAuthenticated()) {
            const loginUser = await this.loginUserService.findOneBy({ id: req.context.getUserId() });
            // TODO: reg workaround
            // if (!loginUser) throw new Error("Login user not found");

            if (loginUser) {
                req.context.setUser(loginUser);

                const revokedAt = loginUser.revokeTokensBefore;
                if (revokedAt) {
                    if (now() > revokedAt.getTime()) throw new Error("Login user revoked tokens");
                }
            }
        }

        // Restore
        await this.restore(req);

        next();
    }

    async restore(req: Request) {
        const request = req.context.tryRequest();
        if (request) {
            req.context.setRequest(request);

            const client = await this.authClientService.findAuthClient(request.clientId);
            if (!client) throw new Error("Client not found");
            if (!client.isValid) throw new Error("Client invalid");
            req.context.setClient(client);
        }

        const activeLoginId = req.context.tryActiveLoginId();
        if (activeLoginId) {
            req.context.setActiveLogin(await this.activeLoginService.findOneBy({ id: req.context.getActiveLoginId() }));
        }

        // TODO: is this even required?!
        const strategyTypeName = req.context.tryStrategyTypeName();
        if (strategyTypeName) {
            req.context.setStrategy(strategyTypeName, this.strategiesService.getStrategyByName(strategyTypeName));
        }

        // req.data.authState = req.session.authState;
    }
}

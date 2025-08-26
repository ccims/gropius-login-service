import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { FlowSession } from "../util/FlowSession";
import { LoginUserService } from "../model/services/login-user.service";
import { now } from "../util/utils";
import { FlowInternalData } from "../util/FlowInternal";
import { JwtService } from "@nestjs/jwt";
import { ActiveLoginService } from "../model/services/active-login.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { StrategiesService } from "../model/services/strategies.service";
import { TokenScope } from "../backend-services/token.service";

@Injectable()
export class FlowSessionInitMiddleware implements NestMiddleware {
    constructor(
        private readonly loginUserService: LoginUserService,
        @Inject("StateJwtService")
        private readonly stateJwtService: JwtService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
        private readonly strategiesService: StrategiesService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Init flow session
        req.flow = new FlowSession(req);
        req.flow.init();

        // Check if expired
        if (req.flow.isExpired()) {
            console.log("flow expired ...");
            req.flow.regenerate();
        }

        // Check if revoked
        if (req.flow.isAuthenticated()) {
            const loginUser = await this.loginUserService.findOneBy({ id: req.flow.getUserId() });
            // TODO: enable this once REG_HOTFIX is resolved
            // if (!loginUser) throw new Error("Login user not found");

            if (loginUser) {
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
        if (!req.flow.middlewares.restore) return;

        const data: FlowInternalData = {};

        const request = req.flow.tryRequest() ?? this.tryRequestFromState(req);
        if (request) {
            data.request = request;
            data.client = await this.authClientService.findAuthClient(request.clientId);
            data.isRegisterAdditional = request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER);
        }

        const activeLoginId = req.flow.tryActiveLoginId();
        if (activeLoginId) {
            data.activeLogin = await this.activeLoginService.findOneBy({ id: req.flow.getActiveLoginId() });
        }

        // TODO: is this even required?!
        const strategyTypeName = req.flow.tryStrategyTypeName();
        if (strategyTypeName) {
            data.strategy = this.strategiesService.getStrategyByName(strategyTypeName);
        }

        // TODO: is this even required? (if yes, then mv this into flow)
        data.authState = req.session.authState;

        req.internal.append(data);
    }

    // TODO: required for req flow?
    tryRequestFromState(req: Request) {
        try {
            const state = req.query.state ?? req.body.state;
            console.log(state);
            if (state) return this.stateJwtService.verify(state);
        } catch (e) {
            console.error(e);
        }
    }
}

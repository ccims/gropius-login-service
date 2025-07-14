import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ActiveLoginService } from "../model/services/active-login.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { TokenScope } from "../backend-services/token.service";
import { ActiveLogin } from "../model/postgres/ActiveLogin.entity";
import { FlowInternalData } from "../util/FlowInternal";
import { JwtService } from "@nestjs/jwt";
import { StrategiesService } from "../model/services/strategies.service";

@Injectable()
export class FlowSessionRestoreMiddleware implements NestMiddleware {
    constructor(
        @Inject("StateJwtService")
        private readonly stateJwtService: JwtService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
        private readonly strategiesService: StrategiesService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.flow.middlewares.restore) return next();

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

        next();
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

import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ActiveLoginService } from "../model/services/active-login.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { TokenScope } from "../backend-services/token.service";
import { ActiveLogin } from "../model/postgres/ActiveLogin.entity";
import { FlowInternalData } from "../util/FlowInternal";

@Injectable()
export class FlowSessionRestoreMiddleware implements NestMiddleware {
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.flow.middlewares.restore) return next();

        const data: FlowInternalData = {};

        const request = req.flow.tryRequest();
        if (request) {
            data.request = request;
            data.client = await this.authClientService.findAuthClient(request.clientId);
            data.isRegisterAdditional = request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER);
        }

        const activeLoginId = req.flow.tryActiveLogin();
        if (activeLoginId) {
            data.activeLogin = await this.activeLoginService.findOneBy({ id: req.flow.getActiveLogin() });
        }

        req.internal.append(data);

        next();
    }
}

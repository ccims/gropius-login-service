import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ActiveLoginService } from "../../model/services/active-login.service";
import { AuthClientService } from "../../model/services/auth-client.service";
import { TokenScope } from "../../backend-services/token.service";

@Injectable()
export class FlowSessionRestoreMiddleware implements NestMiddleware {
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.flow.middlewares.restore) return next();

        // Restore state
        const request = req.flow.getRequest();
        const activeLogin = await this.activeLoginService.findOneBy({ id: req.flow.getActiveLogin() });
        const client = await this.authClientService.findAuthClient(request.clientId);
        const isRegisterAdditional = request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER);
        req.internal.append({ activeLogin, request, client, isRegisterAdditional });

        next();
    }
}

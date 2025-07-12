import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { ActiveLoginService } from "../model/services/active-login.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { AuthStateServerData } from "../strategies/AuthResult";
import { TokenScope } from "../backend-services/token.service";

@Injectable()
export class FlowSessionRestoreMiddleware extends StateMiddleware<
    AuthStateServerData & OAuthAuthorizeServerState,
    AuthStateServerData & OAuthAuthorizeServerState
> {
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
    ) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: AuthStateServerData & OAuthAuthorizeServerState & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        if (!req.flow.middlewares.restore) return next();

        // Restore state
        const request = req.flow.getRequest();
        const activeLogin = await this.activeLoginService.findOneBy({ id: req.flow.getActiveLogin() });
        const client = await this.authClientService.findAuthClient(request.clientId);
        const isRegisterAdditional = request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER);
        this.appendState(res, { activeLogin, request, client, isRegisterAdditional });
        next();
    }
}

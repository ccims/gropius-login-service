import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { ActiveLoginService } from "../model/services/active-login.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { AuthStateServerData } from "../strategies/AuthResult";

@Injectable()
export class AuthFlowSwitchMiddleware extends StateMiddleware<
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
        console.log(req.session);

        if (req.flow.isAuthenticated()) {
            req.flow.setStarted(state.request);
            req.flow.setAuthenticated(req.flow.getUser(), req.flow.getActiveLogin());

            // Restore state
            const request = req.flow.getRequest();
            const activeLogin = await this.activeLoginService.findOneBy({ id: req.flow.getActiveLogin() });
            const client = await this.authClientService.findAuthClient(request.clientId);
            this.appendState(res, { activeLogin, request, client });
        } else {
            req.flow.middlewares.prompt = false;
            req.flow.middlewares.code = false;
        }

        next();
    }
}

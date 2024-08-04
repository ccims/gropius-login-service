import { Inject, Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { AuthException } from "./AuthException";
import { TokenScope } from "src/backend-services/token.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthErrorRedirectMiddleware extends StateMiddleware<OAuthAuthorizeServerState, {}> {
    private readonly logger = new Logger(AuthErrorRedirectMiddleware.name);

    constructor(
        @Inject("StateJwtService")
        private readonly stateJwtService: JwtService,
    ) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        next();
    }

    protected override useWithError(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & { error?: any },
        error: any,
        next: (error?: Error | any) => void,
    ): void {
        if (state.request?.scope && error instanceof AuthException) {
            const target = state.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)
                ? "register-additional"
                : "login";
            const encodedState = encodeURIComponent(this.stateJwtService.sign({ request: state.request }));
            res.redirect(
                `/auth/flow/${target}?error=${encodeURIComponent(error.authErrorMessage)}&strategy_instance=${encodeURIComponent(error.strategyInstanceId)}&state=${encodedState}`,
            );
        } else {
            next();
        }
    }
}

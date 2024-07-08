import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { ActiveLoginTokenResult, TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { AuthStateData } from "src/strategies/AuthResult";
import { ensureState } from "src/strategies/utils";
import { OauthHttpException } from "./OAuthHttpException";

@Injectable()
export class OAuthTokenAuthorizationCodeMiddleware implements NestMiddleware {
    private readonly logger = new Logger(OAuthTokenAuthorizationCodeMiddleware.name);
    constructor(private readonly activeLoginService: ActiveLoginService, private readonly tokenService: TokenService) {}

    private throwGenericCodeError() {
        throw new OauthHttpException("invalid_grant", "Given code was invalid or expired");
    }

    async use(req: Request, res: Response, next: () => void) {
        ensureState(res);
        let tokenData: ActiveLoginTokenResult;
        const currentClient = res.locals.state.client as AuthClient;
        if (!currentClient) {
            this.logger.warn("No client logged in");
            throw new OauthHttpException("invalid_client", "Client unknown or unauthorized");
        }
        try {
            tokenData = await this.tokenService.verifyActiveLoginToken(
                req.body.code ?? req.body.refresh_token,
                currentClient.id,
            );
        } catch (err) {
            this.logger.warn(err);
            return this.throwGenericCodeError();
        }

        const activeLogin = await this.activeLoginService.findOneBy({
            id: tokenData.activeLoginId,
        });
        if (!activeLogin) {
            this.logger.warn("No active login with id", tokenData.activeLoginId);
            return this.throwGenericCodeError();
        }
        const activeLoginClient = await activeLogin.createdByClient;
        if (activeLoginClient.id !== currentClient.id) {
            this.logger.warn("Active login was not created by current client", tokenData.activeLoginId);
            return this.throwGenericCodeError();
        }
        if (!activeLogin.isValid) {
            this.logger.warn("Active login set invalid", tokenData.activeLoginId);
            return this.throwGenericCodeError();
        }
        if (activeLogin.expires != null && activeLogin.expires <= new Date()) {
            this.logger.warn("Active login is expired", tokenData.activeLoginId);
            return this.throwGenericCodeError();
        }
        const codeUniqueId = parseInt(tokenData.tokenUniqueId, 10);
        if (!isFinite(codeUniqueId) || codeUniqueId !== activeLogin.nextExpectedRefreshTokenNumber) {
            //Make active login invalid if code/refresh token is reused
            activeLogin.isValid = false;
            await this.activeLoginService.save(activeLogin);
            this.logger.warn(
                "Code is no longer valid as it was already used and a token was already generated.\n " +
                    "Active login has been made invalid",
                tokenData.activeLoginId,
            );
            throw new OauthHttpException("invalid_grant", "Given code was liekely reused. Login and codes invalidated");
        }
        (res.locals.state as AuthStateData).activeLogin = activeLogin;
        next();
    }
}

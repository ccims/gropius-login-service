import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { RefreshTokenResult, TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "../errors/OAuthHttpException";
import { LoginState } from "src/model/postgres/UserLoginData.entity";
import { OauthTokenResponse } from "../api-oauth/types";
import { ActiveLoginAccessService } from "../model/services/active-login-access.service";
import { ms2s } from "../util/utils";

@Injectable()
export class TokenExchangeRefreshTokenService {
    private readonly logger = new Logger(TokenExchangeRefreshTokenService.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
        private readonly activeLoginAccessService: ActiveLoginAccessService,
    ) {}

    /**
     * Exchange refresh token for access token
     */
    async use(req: Request, res: Response, client: AuthClient): Promise<OauthTokenResponse> {
        /**
         * Refresh Token
         */
        const token = req.body.refresh_token;
        let data: RefreshTokenResult;
        try {
            data = await this.tokenService.verifyRefreshToken(token, client.id);
        } catch (err: any) {
            this.logger.warn(err);
            throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
        }

        /**
         * ActiveLoginAccess
         */
        const activeLoginAccess = await this.activeLoginAccessService.findOneByOrFail({ id: data.activeLoginAccessId });
        activeLoginAccess.assert();

        /**
         * Check refresh token counter
         */
        if (parseInt(data.tokenUniqueId) !== activeLoginAccess.refreshTokenCounter) {
            this.logger.warn("Refresh token counter does not match", data.activeLoginAccessId);
            activeLoginAccess.isValid = false;
            await this.activeLoginAccessService.save(activeLoginAccess);
            throw new OAuthHttpException("invalid_grant", "Refresh token has been used already");
        }

        /**
         * Scope
         */
        for (const requestedScope of data.scope) {
            if (!client.validScopes.includes(requestedScope)) {
                throw new OAuthHttpException("invalid_scope", "Requested scope not valid for client");
            }
        }

        /**
         * Active Login
         */
        const activeLogin = activeLoginAccess.activeLogin;
        activeLogin.assert();
        await this.activeLoginService.extendExpiration(activeLogin);

        /**
         * Login Data
         */
        const loginData = await activeLogin.loginInstanceFor;
        if (!loginData) {
            throw new OAuthHttpException("invalid_grant", "No login found for given grant (refresh token/code)");
        }

        if (loginData.state !== LoginState.VALID) {
            throw new OAuthHttpException("invalid_grant", "Login data state is not valid");
        }

        const user = await loginData.user;
        if (!user) {
            throw new OAuthHttpException("invalid_state", "No user for valid login");
        }

        /**
         * Response
         */
        const tokenExpiresInMs: number = parseInt(process.env.GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS, 10);
        const accessToken = await this.tokenService.signAccessToken(await loginData.user, data.scope, tokenExpiresInMs);

        activeLoginAccess.refreshTokenCounter++;
        await this.activeLoginAccessService.save(activeLoginAccess);

        const refreshToken = await this.tokenService.signRefreshToken(
            activeLoginAccess.id,
            client.id,
            activeLoginAccess.refreshTokenCounter,
            data.scope,
        );

        return {
            access_token: accessToken,
            token_type: "bearer",
            expires_in: ms2s(tokenExpiresInMs),
            refresh_token: refreshToken,
            scope: data.scope.join(" "),
        };
    }
}

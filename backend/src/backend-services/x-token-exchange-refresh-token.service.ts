import { Injectable, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { type RefreshTokenResult, TokenService } from "./token.service.js";
import { AuthClient } from "../model/postgres/AuthClient.entity.js";
import { ActiveLoginService } from "../model/services/active-login.service.js";
import { OAuthHttpException } from "../errors/OAuthHttpException.js";
import { LoginState } from "../model/postgres/UserLoginData.entity.js";
import { OauthTokenResponse } from "../api-oauth/types.js";
import { ActiveLoginAccessService } from "../model/services/active-login-access.service.js";
import { ms2s } from "../util/utils.js";

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
         * Rotate the refresh token
         *
         * Compare-and-increment happens in a single statement, so that two concurrent
         * redemptions of the same refresh token cannot both pass the check. Losing the race
         * means the token was already used, which is treated as replay: the access is revoked.
         */
        const presentedCounter = parseInt(data.tokenUniqueId, 10);
        const rotated =
            Number.isInteger(presentedCounter) &&
            (await this.activeLoginAccessService.rotateRefreshToken(activeLoginAccess.id, presentedCounter));
        if (!rotated) {
            this.logger.warn("Refresh token counter does not match", data.activeLoginAccessId);
            activeLoginAccess.isValid = false;
            await this.activeLoginAccessService.save(activeLoginAccess);
            throw new OAuthHttpException("invalid_grant", "Refresh token has been used already");
        }
        activeLoginAccess.refreshTokenCounter = presentedCounter + 1;

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

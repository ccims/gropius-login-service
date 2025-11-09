import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { RefreshTokenResult, TokenScope, TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { OauthTokenResponse } from "../api-oauth/types";
import { ActiveLoginAccessService } from "../model/services/active-login-access.service";
import { ActiveLoginAccess } from "../model/postgres/ActiveLoginAccess.entity";

@Injectable()
export class TokenExchangeRefreshTokenService {
    private readonly logger = new Logger(TokenExchangeRefreshTokenService.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
        private readonly activeLoginAccessService: ActiveLoginAccessService,
    ) {}

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
            this.throwGenericCodeError();
        }

        /**
         * ActiveLoginAccess
         */
        // TODO: activeLoginId is actually activeLoginAccessId here
        const activeLoginAccess = await this.activeLoginAccessService.getAsserted(data.activeLoginId);

        const codeUniqueId = parseInt(data.tokenUniqueId, 10);
        if (!isFinite(codeUniqueId) || codeUniqueId !== activeLoginAccess.refreshTokenCounter) {
            this.logger.warn(
                "Code is no longer valid as it was already used and a token was already generated.\n " +
                    "Active login has been made invalid",
                data.activeLoginId,
            );

            //Make active login invalid if code/refresh token is reused
            activeLoginAccess.isValid = false;
            await this.activeLoginAccessService.save(activeLoginAccess);
            throw new OAuthHttpException("invalid_grant", "Given code was likely reused. Login and codes invalidated");
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
         * Access Token
         */
        return await this.createAccessToken(loginData, activeLoginAccess, client, data.scope);
    }

    private throwGenericCodeError() {
        throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
    }

    private async createAccessToken(
        loginData: UserLoginData,
        activeLoginAccess: ActiveLoginAccess,
        currentClient: AuthClient,
        scope: TokenScope[],
    ): Promise<OauthTokenResponse> {
        const tokenExpiresInMs: number = parseInt(process.env.GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS, 10);

        const accessToken = await this.tokenService.signAccessToken(await loginData.user, scope, tokenExpiresInMs);

        activeLoginAccess.refreshTokenCounter++;
        await this.activeLoginAccessService.save(activeLoginAccess);

        const refreshToken = await this.tokenService.signRefreshToken(
            activeLoginAccess.id,
            currentClient.id,
            activeLoginAccess.refreshTokenCounter,
            scope,
        );

        return {
            access_token: accessToken,
            token_type: "bearer",
            expires_in: Math.floor(tokenExpiresInMs / 1000),
            refresh_token: refreshToken,
            scope: scope.join(" "),
        };
    }
}

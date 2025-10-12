import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthorizationCodeResult, TokenScope, TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import { EncryptionService } from "./encryption.service";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";

import { OauthTokenResponse } from "../api-oauth/types";
import { compareTimeSafe } from "../util/utils";
import { ActiveLoginAccessService } from "../model/services/active-login-access.service";
import { ActiveLoginAccess } from "../model/postgres/ActiveLoginAccess.entity";

@Injectable()
export class TokenExchangeAuthorizationCodeService {
    private readonly logger = new Logger(TokenExchangeAuthorizationCodeService.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
        private readonly encryptionService: EncryptionService,
        private readonly activeLoginAccessService: ActiveLoginAccessService,
    ) {}

    // TODO: ensure that auth code is only exchanged once?
    async use(req: Request, res: Response, client: AuthClient): Promise<OauthTokenResponse> {
        /**
         * Authorization Code
         */
        const token = req.body.code;
        let data: AuthorizationCodeResult;
        try {
            data = await this.tokenService.verifyAuthorizationCode(token, client.id);
        } catch (err: any) {
            this.logger.warn(err);
            throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
        }

        /**
         * Active Login
         */
        const activeLogin = await this.activeLoginService.getValid(data.activeLoginAccessId);

        /**
         * Code Challenge
         */
        const codeVerifier = req.body.code_verifier;
        if (!codeVerifier) {
            this.logger.warn("Code verifier missing");
            throw new OAuthHttpException("invalid_request", "Code verifier missing");
        }

        if (typeof codeVerifier !== "string") {
            this.logger.warn("Code verifier is not a string");
            throw new OAuthHttpException("invalid_request", "Code verifier has invalid format");
        }

        const decryptedCodeChallenge = this.encryptionService.decrypt(data.codeChallenge);
        const codeChallenge = this.tokenService.calculateCodeChallenge(codeVerifier);
        if (!compareTimeSafe(decryptedCodeChallenge, codeChallenge)) {
            this.logger.warn("Code verifier does not match code challenge");
            throw new OAuthHttpException("invalid_request", "Code verifier does not match code challenge");
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
         * Login Data
         */
        const loginData = await activeLogin.loginInstanceFor;
        if (!loginData) {
            this.logger.warn("Login data not found");
            throw new OAuthHttpException("invalid_grant", "No login found for given grant (refresh token/code)");
        }

        if (loginData.isExpired) {
            throw new OAuthHttpException("invalid_grant", "Login data has expired.");
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
        return await this.createAccessToken(loginData, activeLogin, client, data.scope);
    }

    private async createAccessToken(
        loginData: UserLoginData,
        activeLogin: ActiveLogin,
        currentClient: AuthClient,
        scope: TokenScope[],
    ): Promise<OauthTokenResponse> {
        const tokenExpiresInMs: number = parseInt(process.env.GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS, 10);

        const accessToken = await this.tokenService.signAccessToken(await loginData.user, scope, tokenExpiresInMs);

        const activeLoginAccess = await this.activeLoginAccessService.save(new ActiveLoginAccess(activeLogin, 1));

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

import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ActiveLoginTokenResult, TokenScope, TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import { EncryptionService } from "./encryption.service";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";

import { OauthTokenResponse } from "../api-oauth/types";
import { compareTimeSafe } from "../util/utils";
import { ActiveLoginAccess } from "../model/postgres/ActiveLoginAccess.entity";
import { ActiveLoginAccessService } from "../model/services/active-login-access.service";

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
        let data: ActiveLoginTokenResult;
        try {
            data = await this.tokenService.verifyAuthorizationCode(token, client.id);
        } catch (err: any) {
            this.logger.warn(err);
            throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
        }

        /**
         * Active Login
         */
        const activeLogin = await this.activeLoginService.getValid(data.activeLoginId);

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

        let accessToken: string;
        // TODO: when would this even happen?
        if (loginData.state == LoginState.WAITING_FOR_REGISTER) {
            accessToken = await this.tokenService.signRegistrationToken(activeLogin.id, tokenExpiresInMs);
        } else {
            accessToken = await this.tokenService.signAccessToken(await loginData.user, scope, tokenExpiresInMs);
        }

        // TODO: this
        const expires = new Date(new Date().getTime() + 1_000_000_000_000);

        const activeLoginAccess = await this.activeLoginAccessService.createSave(activeLogin, expires);
        activeLoginAccess.refreshTokenCounter++;
        await this.activeLoginAccessService.save(activeLoginAccess);

        const refreshToken = await this.tokenService.signRefreshToken(
            activeLoginAccess.id,
            currentClient.id,
            activeLoginAccess.refreshTokenCounter,
            scope,
            activeLoginAccess.expires,
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

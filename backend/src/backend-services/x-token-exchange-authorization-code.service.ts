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

@Injectable()
export class TokenExchangeAuthorizationCodeService {
    private readonly logger = new Logger(TokenExchangeAuthorizationCodeService.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
        private readonly encryptionService: EncryptionService,
    ) {}

    async use(req: Request, res: Response, client: AuthClient): Promise<OauthTokenResponse> {
        /**
         * Authorization Code/ Refresh Token
         */
        const token = req.body.code ?? req.body.refresh_token;
        let data: ActiveLoginTokenResult;
        try {
            data = await this.tokenService.verifyActiveLoginToken(token, client.id);
        } catch (err: any) {
            this.logger.warn(err);
            this.throwGenericCodeError();
        }

        /**
         * Active Login
         */
        const activeLogin = await this.activeLoginService.findOneByOrFail({
            id: data.activeLoginId,
        });

        if (!activeLogin) {
            this.logger.warn("No active login with id", data.activeLoginId);
            this.throwGenericCodeError();
        }

        if (!activeLogin.isValid) {
            this.logger.warn("Active login set invalid", data.activeLoginId);
            this.throwGenericCodeError();
        }

        if (activeLogin.isExpired) {
            this.logger.warn("Active login is expired", data.activeLoginId);
            this.throwGenericCodeError();
        }

        const codeUniqueId = parseInt(data.tokenUniqueId, 10);
        if (!isFinite(codeUniqueId) || codeUniqueId !== activeLogin.nextExpectedRefreshTokenNumber) {
            this.logger.warn(
                "Code is no longer valid as it was already used and a token was already generated.\n " +
                    "Active login has been made invalid",
                data.activeLoginId,
            );

            // TODO: this
            /**
            //Make active login invalid if code/refresh token is reused
            activeLogin.isValid = false;
            await this.activeLoginService.save(activeLogin);
            throw new OAuthHttpException("invalid_grant", "Given code was likely reused. Login and codes invalidated");
                **/
        }

        /**
         * Code Challenge
         */
        if (data.codeChallenge) {
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
            if (decryptedCodeChallenge !== codeChallenge) {
                this.logger.warn("Code verifier does not match code challenge");
                throw new OAuthHttpException("invalid_request", "Code verifier does not match code challenge");
            }
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
            this.logger.warn("Login data has expired", loginData);
            throw new OAuthHttpException(
                "invalid_grant",
                "Login has expired. Try restarting login/register/link process.",
            );
        }

        if (loginData.state === LoginState.BLOCKED) {
            throw new OAuthHttpException(
                "invalid_grant",
                "Login for given grant is not valid any more; Please re-login",
            );
        }

        const user = await loginData.user;
        if (loginData.state === LoginState.VALID) {
            if (!user) {
                throw new OAuthHttpException("invalid_state", "No user for valid login");
            }
        }

        if (loginData.state === LoginState.WAITING_FOR_REGISTER) {
            if (user) {
                throw new OAuthHttpException(
                    "invalid_state",
                    "Login still in register state but user already existing",
                );
            }
        }

        /**
         * Access Token
         */
        return await this.createAccessToken(loginData, activeLogin, client, data.scope);
    }

    private throwGenericCodeError() {
        throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
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

        activeLogin.nextExpectedRefreshTokenNumber++;
        await this.activeLoginService.save(activeLogin);

        const refreshToken = await this.tokenService.signActiveLoginCode(
            activeLogin.id,
            currentClient.id,
            activeLogin.nextExpectedRefreshTokenNumber,
            scope,
            activeLogin.expires ?? undefined,
            undefined,
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

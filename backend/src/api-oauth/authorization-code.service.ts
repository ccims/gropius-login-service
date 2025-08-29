import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ActiveLoginTokenResult, TokenScope, TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "./OAuthHttpException";
import { EncryptionService } from "../backend-services/encryption.service";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { OauthTokenResponse } from "./dto/oauth-token-response.dto";

@Injectable()
export class AuthorizationCodeService {
    readonly supportedGrantTypes = ["authorization_code", "refresh_token"];

    private readonly logger = new Logger(AuthorizationCodeService.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
        private readonly encryptionService: EncryptionService,
    ) {}

    private throwGenericCodeError() {
        throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
    }

    private async validateLoginData(loginData?: UserLoginData) {
        if (!loginData) {
            this.logger.warn("Login data not found");
            throw new OAuthHttpException("invalid_grant", "No login found for given grant (refresh token/code)");
        }

        if (loginData.expires != null && loginData.expires <= new Date()) {
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

        // TODO: when would this even happen?
        const user = await loginData.user;
        if (loginData.state === LoginState.VALID) {
            if (!user) {
                throw new OAuthHttpException("invalid_state", "No user for valid login");
            }
        }

        // TODO: when would this even happen?
        if (loginData.state === LoginState.WAITING_FOR_REGISTER) {
            if (user) {
                throw new OAuthHttpException(
                    "invalid_state",
                    "Login still in register state but user already existing",
                );
            }
        }
    }

    private async updateRefreshTokenIdAndExpirationDate(
        activeLogin: ActiveLogin,
        isRegisterLogin: boolean,
    ): Promise<ActiveLogin> {
        const loginExpiresIn = parseInt(process.env.GROPIUS_REGULAR_LOGINS_INACTIVE_EXPIRATION_TIME_MS, 10);
        this.logger.debug("Updating active login", isRegisterLogin, loginExpiresIn, activeLogin.supportsSync);
        if (!isRegisterLogin) {
            activeLogin = await this.activeLoginService.setActiveLoginExpiration(activeLogin);
        }
        activeLogin.nextExpectedRefreshTokenNumber++;
        return await this.activeLoginService.save(activeLogin);
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

        activeLogin = await this.updateRefreshTokenIdAndExpirationDate(
            activeLogin,
            loginData.state == LoginState.WAITING_FOR_REGISTER,
        );

        const refreshToken =
            loginData.state != LoginState.WAITING_FOR_REGISTER
                ? await this.tokenService.signActiveLoginCode(
                      activeLogin.id,
                      currentClient.id,
                      activeLogin.nextExpectedRefreshTokenNumber,
                      scope,
                      activeLogin.expires ?? undefined,
                      undefined,
                  )
                : undefined;
        return {
            access_token: accessToken,
            token_type: "bearer",
            expires_in: Math.floor(tokenExpiresInMs / 1000),
            refresh_token: refreshToken,
            scope: scope.join(" "),
        };
    }

    async handle(req: Request, res: Response, client: AuthClient) {
        const codeVerifier = req.body.code_verifier;
        const token = req.body.code ?? req.body.refresh_token;

        let data: ActiveLoginTokenResult;
        try {
            data = await this.tokenService.verifyActiveLoginToken(token, client.id);
        } catch (err: any) {
            this.logger.warn(err);
            this.throwGenericCodeError();
        }

        const activeLogin = await this.activeLoginService.findOneBy({
            id: data.activeLoginId,
        });

        if (!activeLogin) {
            this.logger.warn("No active login with id", data.activeLoginId);
            this.throwGenericCodeError();
        }

        if (!activeLogin.isValid) {
            this.logger.warn("Active login set invalid", data.activeLoginId);
            // TODO: this.throwGenericCodeError();
        }

        if (activeLogin.expires != null && activeLogin.expires <= new Date()) {
            this.logger.warn("Active login is expired", data.activeLoginId);
            // TODO: return this.throwGenericCodeError();
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

        if (data.codeChallenge) {
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

        for (const requestedScope of data.scope) {
            if (!client.validScopes.includes(requestedScope)) {
                throw new OAuthHttpException("invalid_scope", "Requested scope not valid for client");
            }
        }

        const loginData = await activeLogin.loginInstanceFor;
        await this.validateLoginData(loginData);

        return await this.createAccessToken(loginData, activeLogin, client, data.scope);
    }
}

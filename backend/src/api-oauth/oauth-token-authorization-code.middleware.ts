import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ActiveLoginTokenResult, TokenScope, TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "./OAuthHttpException";
import { EncryptionService } from "./encryption.service";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { OAuthTokenResponseDto } from "./dto/oauth-token-response.dto";

@Injectable()
export class OAuthTokenAuthorizationCodeMiddleware implements NestMiddleware {
    private readonly logger = new Logger(OAuthTokenAuthorizationCodeMiddleware.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
        private readonly encryptionService: EncryptionService,
    ) {}

    private throwGenericCodeError() {
        throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
    }

    private async checkLoginDataIsVaild(loginData?: UserLoginData, activeLogin?: ActiveLogin) {
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
        switch (loginData.state) {
            case LoginState.VALID:
                if (!(await loginData.user)) {
                    throw new OAuthHttpException("invalid_state", "No user for valid login");
                }
                break;
            case LoginState.WAITING_FOR_REGISTER:
                if (await loginData.user) {
                    throw new OAuthHttpException(
                        "invalid_state",
                        "Login still in register state but user already existing",
                    );
                }
                break;
            default:
                throw new OAuthHttpException(
                    "invalid_grant",
                    "Login for given grant is not valid any more; Please re-login",
                );
        }
        if (!activeLogin) {
            this.logger.warn("Active login not found");
            throw new OAuthHttpException("invalid_grant", "No login found for given grant (refresh token/code)");
        }
        if (activeLogin.expires != null && activeLogin.expires <= new Date()) {
            this.logger.warn("Active login has expired", activeLogin.id);
            throw new OAuthHttpException(
                "invalid_grant",
                "Login has expired. Try restarting login/register/link process.",
            );
        }
        if (!activeLogin.isValid) {
            this.logger.warn("Active login is set invalid", activeLogin.id);
            throw new OAuthHttpException("invalid_grant", "Login is set invalid/disabled");
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
    ): Promise<OAuthTokenResponseDto> {
        const tokenExpiresInMs: number = parseInt(process.env.GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS, 10);

        let accessToken: string;
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

    private async createResponse(
        client: AuthClient,
        scope: TokenScope[],
        activeLogin: ActiveLogin,
    ): Promise<OAuthTokenResponseDto> {
        for (const requestedScope of scope) {
            if (!client.validScopes.includes(requestedScope)) {
                throw new OAuthHttpException("invalid_scope", "Requested scope not valid for client");
            }
        }
        const loginData = await activeLogin.loginInstanceFor;
        await this.checkLoginDataIsVaild(loginData, activeLogin);
        return await this.createAccessToken(loginData, activeLogin, client, scope);
    }

    async use(req: Request, res: Response, next: NextFunction) {
        let tokenData: ActiveLoginTokenResult;
        const currentClient = req.internal.getClient();
        const codeVerifier = req.body.code_verifier;
        try {
            tokenData = await this.tokenService.verifyActiveLoginToken(
                req.body.code ?? req.body.refresh_token,
                currentClient.id,
            );
        } catch (err: any) {
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
            throw new OAuthHttpException("invalid_grant", "Given code was liekely reused. Login and codes invalidated");
        }
        if (tokenData.codeChallenge != undefined) {
            if (codeVerifier == undefined) {
                this.logger.warn("Code verifier missing");
                throw new OAuthHttpException("invalid_request", "Code verifier missing");
            }
            if (typeof codeVerifier !== "string") {
                this.logger.warn("Code verifier is not a string");
                throw new OAuthHttpException("invalid_request", "Code verifier has invalid format");
            }
            const decryptedCodeChallenge = this.encryptionService.decrypt(tokenData.codeChallenge);
            const codeChallenge = this.tokenService.calculateCodeChallenge(codeVerifier);
            if (decryptedCodeChallenge !== codeChallenge) {
                this.logger.warn("Code verifier does not match code challenge");
                throw new OAuthHttpException("invalid_request", "Code verifier does not match code challenge");
            }
        } else {
            if (codeVerifier != undefined) {
                this.logger.warn("Code verifier not required");
                throw new OAuthHttpException("invalid_request", "Code verifier not required");
            }
        }
        const response = await this.createResponse(currentClient, tokenData.scope, activeLogin);
        res.json(response);
    }
}

import { All, Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { AuthClientService } from "src/model/services/auth-client.service";
import { OpenApiTag } from "src/openapi-tag";
import { AuthStateServerData } from "src/strategies/AuthResult";
import { ensureState } from "src/strategies/utils";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";

export interface OauthTokenEndpointResponseDto {
    access_token: string;
    token_type: "bearer";
    expires_in: number;
    refresh_token: string;
    scope: string;
}

@Controller()
@ApiTags(OpenApiTag.OAUTH_API)
export class OAuthTokenController {
    private readonly logger = new Logger(OAuthTokenController.name);
    constructor(
        private readonly authClientService: AuthClientService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
    ) {}

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
        currentClient: AuthClient,
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
    ): Promise<OauthTokenEndpointResponseDto> {
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
            currentClient,
        );

        const refreshToken =
            loginData.state != LoginState.WAITING_FOR_REGISTER
                ? await this.tokenService.signActiveLoginCode(
                      activeLogin.id,
                      currentClient.id,
                      activeLogin.nextExpectedRefreshTokenNumber,
                      scope,
                      activeLogin.expires ?? undefined,
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

    @Post("token")
    async token(@Res({ passthrough: true }) res: Response): Promise<OauthTokenEndpointResponseDto> {
        ensureState(res);
        const currentClient = res.locals.state.client as AuthClient;
        const scope = res.locals.state.scope as TokenScope[];
        if (!currentClient) {
            throw new OAuthHttpException(
                "invalid_client",
                "No client id/authentication given or authentication invalid",
            );
        }
        for (const requestedScope of scope) {
            if (!currentClient.validScopes.includes(requestedScope)) {
                console.log(requestedScope, currentClient.validScopes)
                throw new OAuthHttpException("invalid_scope", "Requested scope not valid for client");
            }
        }
        let activeLogin = (res.locals.state as AuthStateServerData)?.activeLogin;
        if (typeof activeLogin == "string") {
            activeLogin = await this.activeLoginService.findOneByOrFail({
                id: activeLogin,
            });
        }
        const loginData = await activeLogin.loginInstanceFor;
        await this.checkLoginDataIsVaild(loginData, activeLogin);
        return await this.createAccessToken(loginData, activeLogin, currentClient, scope);
    }
}

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
import { AuthStateData } from "src/strategies/AuthResult";
import { ensureState } from "src/strategies/utils";
import { OauthServerStateData } from "./oauth-autorize.middleware";
import { OauthHttpException } from "./OauthHttpException";

export interface OauthTokenEdnpointResponseDto {
    access_token: string;
    token_type: "bearer";
    expires_in: number;
    refresh_token: string;
    scope: string;
}

@Controller("oauth")
@ApiTags(OpenApiTag.CREDENTIALS)
export class OauthTokenController {
    private readonly logger = new Logger(OauthTokenController.name);
    constructor(
        private readonly authClientService: AuthClientService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
    ) { }

    private async checkLoginDataIsVaild(loginData?: UserLoginData, activeLogin?: ActiveLogin) {
        if (!loginData) {
            this.logger.warn("Login data not found");
            throw new OauthHttpException("invalid_grant", "No login found for given grant (refresh token/code)");
        }
        if (loginData.expires != null && loginData.expires <= new Date()) {
            this.logger.warn("Login data has expired", loginData);
            throw new OauthHttpException(
                "invalid_grant",
                "Login has expired. Try restarting login/register/link process.",
            );
        }
        switch (loginData.state) {
            case LoginState.VALID:
                if (!(await loginData.user)) {
                    throw new OauthHttpException("invalid_state", "No user for valid login");
                }
                break;
            case LoginState.WAITING_FOR_REGISTER:
                if (await loginData.user) {
                    throw new OauthHttpException(
                        "invalid_state",
                        "Login still in register state but user already existing",
                    );
                }
                break;
            default:
                throw new OauthHttpException(
                    "invalid_grant",
                    "Login for given grant is not valid any more; Please re-login",
                );
        }
        if (!activeLogin) {
            this.logger.warn("Active login not found");
            throw new OauthHttpException("invalid_grant", "No login found for given grant (refresh token/code)");
        }
        if (activeLogin.expires != null && activeLogin.expires <= new Date()) {
            this.logger.warn("Active login has expired", activeLogin.id);
            throw new OauthHttpException(
                "invalid_grant",
                "Login has expired. Try restarting login/register/link process.",
            );
        }
        if (!activeLogin.isValid) {
            this.logger.warn("Active login is set invalid", activeLogin.id);
            throw new OauthHttpException("invalid_grant", "Login is set invalid/disabled");
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
        activeLogin.createdByClient = Promise.resolve(currentClient);
        return await this.activeLoginService.save(activeLogin);
    }

    private async createAccessToken(
        loginData: UserLoginData,
        activeLogin: ActiveLogin,
        currentClient: AuthClient,
    ): Promise<OauthTokenEdnpointResponseDto> {
        const tokenExpiresInMs: number = parseInt(process.env.GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS, 10);

        let accessToken: string;
        let tokenScope: TokenScope[];
        if (loginData.state == LoginState.WAITING_FOR_REGISTER) {
            tokenScope = [TokenScope.LOGIN_SERVICE_REGISTER];
            accessToken = await this.tokenService.signRegistrationToken(activeLogin.id, tokenExpiresInMs);
        } else {
            tokenScope = [TokenScope.BACKEND, TokenScope.LOGIN_SERVICE];
            accessToken = await this.tokenService.signBackendAccessToken(await loginData.user, tokenExpiresInMs);
        }

        activeLogin = await this.updateRefreshTokenIdAndExpirationDate(
            activeLogin,
            loginData.state == LoginState.WAITING_FOR_REGISTER,
            currentClient,
        );

        const refreshToken = await this.tokenService.signActiveLoginCode(
            activeLogin.id,
            currentClient.id,
            activeLogin.nextExpectedRefreshTokenNumber,
            activeLogin.expires ?? undefined
        );
        return {
            access_token: accessToken,
            token_type: "bearer",
            expires_in: Math.floor(tokenExpiresInMs / 1000),
            refresh_token: refreshToken,
            scope: tokenScope.join(" "),
        };
    }

    @Post(":id?/token/:mode?")
    async token(@Res({ passthrough: true }) res: Response): Promise<OauthTokenEdnpointResponseDto> {
        ensureState(res);
        const currentClient = (res.locals.state as OauthServerStateData).client;
        if (!currentClient) {
            throw new OauthHttpException(
                "invalid_client",
                "No client id/authentication given or authentication invalid",
            );
        }
        let activeLogin = (res.locals.state as AuthStateData)?.activeLogin;
        if (typeof activeLogin == "string") {
            activeLogin = await this.activeLoginService.findOneByOrFail({
                id: activeLogin,
            });
        }
        const loginData = await activeLogin.loginInstanceFor;
        await this.checkLoginDataIsVaild(loginData, activeLogin);
        return await this.createAccessToken(loginData, activeLogin, currentClient);
    }
}

import { Inject, Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { AuthStateServerData } from "../strategies/AuthResult";
import { OAuthHttpException } from "src/api-oauth/OAuthHttpException";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { JwtService } from "@nestjs/jwt";
import { Strategy } from "src/strategies/Strategy";
import { LoginUserService } from "src/model/services/login-user.service";
import { combineURL } from "src/util/combineURL";

/**
 * Return data of the user data suggestion endpoint
 */
interface UserDataSuggestion {
    /**
     * A potential username to use for the registration.
     * If one is given, it was free the moment the suggestion is retrieved
     *
     * @example "testUser"
     */
    username?: string;

    /**
     * A potential name to display in the UI for the new user.
     *
     * @example "Test User"
     */
    displayName?: string;

    /**
     * A potential email of the new user.
     *
     * @example "test-user@example.com"
     */
    email?: string;
}

@Injectable()
export class AuthRedirectMiddleware extends StateMiddleware<
    AuthStateServerData & OAuthAuthorizeServerState & { strategy: Strategy; secondToken?: boolean }
> {
    private readonly logger = new Logger(AuthRedirectMiddleware.name);
    constructor(
        private readonly tokenService: TokenService,
        private readonly activeLoginService: ActiveLoginService,
        @Inject("StateJwtService")
        private readonly stateJwtService: JwtService,
        private readonly userService: LoginUserService,
    ) {
        super();
    }

    // TODO: this needs to be adapted to the "automatic login thing"
    private async assignActiveLoginToClient(
        state: AuthStateServerData & OAuthAuthorizeServerState & { secondToken?: boolean },
        expiresIn: number,
    ): Promise<number> {
        if (!state.activeLogin.isValid) {
            throw new Error("Active login invalid");
        }
        // if the login service handles the registration, two tokens were already generated: the code and the access token
        if (
            state.activeLogin.nextExpectedRefreshTokenNumber !=
            ActiveLogin.LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIEVED + (state.secondToken ? 2 : 0)
        ) {
            // TODO: throw new Error("Refresh token id is not initial anymore even though no token was retrieved");
        }
        if (state.activeLogin.expires != null && state.activeLogin.expires <= new Date()) {
            throw new Error("Active login expired");
        }
        if (state.activeLogin.expires == null) {
            state.activeLogin.expires = new Date(Date.now() + expiresIn);
        }
        const codeJwtId = ++state.activeLogin.nextExpectedRefreshTokenNumber;

        state.activeLogin = await this.activeLoginService.save(state.activeLogin);

        return codeJwtId;
    }

    private async generateCode(
        state: AuthStateServerData & OAuthAuthorizeServerState & { secondToken?: boolean },
        clientId: string,
        scope: TokenScope[],
        pkce: boolean,
    ): Promise<string> {
        const activeLogin = state.activeLogin;
        try {
            const expiresIn = parseInt(process.env.GROPIUS_OAUTH_CODE_EXPIRATION_TIME_MS, 10);
            const codeJwtId = await this.assignActiveLoginToClient(state, expiresIn);
            const token = await this.tokenService.signActiveLoginCode(
                activeLogin.id,
                clientId,
                codeJwtId,
                scope,
                expiresIn,
                pkce ? state.request.codeChallenge : undefined,
            );
            this.logger.debug("Created token");
            return token;
        } catch (err) {
            this.logger.warn(err);
            throw new OAuthHttpException("server_error", "Could not generate code for response");
        }
    }

    /**
     * Return username, display name and email suggestions for registering a user
     * @param input The input data containing the registration token to retrieve suggestions for
     */
    async getDataSuggestions(loginData: UserLoginData, strategy: Strategy): Promise<UserDataSuggestion> {
        const suggestions = strategy.getUserDataSuggestion(loginData);

        if (suggestions.username) {
            const numUsers = await this.userService.countBy({ username: suggestions.username.trim() });
            if (numUsers > 0) {
                return {
                    email: suggestions.email,
                };
            }
        }
        if (!suggestions.username && !suggestions.displayName && !suggestions.email) {
            return {};
        }
        return {
            username: suggestions.username,
            displayName: suggestions.displayName,
            email: suggestions.email,
        };
    }

    override async useWithState(
        req: Request,
        res: Response,
        state: AuthStateServerData & OAuthAuthorizeServerState & { strategy: Strategy } & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        // Check if middleware is enabled
        if (!req.flow.middlewares.code) return next();

        if (!state.activeLogin) {
            throw new OAuthHttpException("server_error", "No active login");
        }
        const userLoginData = await state.activeLogin.loginInstanceFor;
        if (state.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)) {
            if (userLoginData.state === LoginState.WAITING_FOR_REGISTER) {
                await this.redirectWithCode(state, res);
            } else {
                throw new OAuthHttpException("invalid_request", "Login is not in register state");
            }
        } else {
            if (userLoginData.state === LoginState.WAITING_FOR_REGISTER) {
                const encodedState = encodeURIComponent(
                    this.stateJwtService.sign({ request: state.request, authState: state.authState }),
                );
                const token = await this.generateCode(
                    state,
                    "login-auth-client",
                    [TokenScope.LOGIN_SERVICE_REGISTER],
                    false,
                );
                const suggestions = await this.getDataSuggestions(userLoginData, state.strategy);
                const suggestionQuery = `&email=${encodeURIComponent(
                    suggestions.email ?? "",
                )}&username=${encodeURIComponent(suggestions.username ?? "")}&displayName=${encodeURIComponent(
                    suggestions.displayName ?? "",
                )}&forceSuggestedUsername=${state.strategy.forceSuggestedUsername}`;
                const url = `auth/flow/register?code=${token}&state=${encodedState}` + suggestionQuery;
                res.redirect(combineURL(url, process.env.GROPIUS_ENDPOINT).toString());
            } else {
                await this.redirectWithCode(state, res);
            }
        }
    }

    private async redirectWithCode(
        state: AuthStateServerData & OAuthAuthorizeServerState & { strategy: Strategy } & { error?: any },
        res: Response<any, Record<string, any>>,
    ) {
        const url = new URL(state.request.redirect);
        const token = await this.generateCode(state, state.client.id, state.request.scope, true);
        url.searchParams.append("code", token);
        url.searchParams.append("state", state.request.state ?? "");
        res.redirect(url.toString());
    }
}

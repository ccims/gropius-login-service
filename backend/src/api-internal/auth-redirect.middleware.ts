import { Inject, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "src/api-oauth/OAuthHttpException";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { JwtService } from "@nestjs/jwt";
import { Strategy } from "src/strategies/Strategy";
import { LoginUserService } from "src/model/services/login-user.service";
import { combineURL } from "../util/utils";

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
export class AuthRedirectMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthRedirectMiddleware.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly activeLoginService: ActiveLoginService,
        @Inject("StateJwtService")
        private readonly stateJwtService: JwtService,
        private readonly userService: LoginUserService,
    ) {}

    // TODO: this needs to be adapted to the "automatic login thing"
    private async assignActiveLoginToClient(req: Request, expiresIn: number): Promise<number> {
        const activeLogin = req.internal.tryActiveLogin();

        if (!activeLogin.isValid) {
            throw new Error("Active login invalid");
        }
        // if the login service handles the registration, two tokens were already generated: the code and the access token
        if (
            activeLogin.nextExpectedRefreshTokenNumber !=
            ActiveLogin.LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIEVED + (req.internal.getSecondToken() ? 2 : 0)
        ) {
            // TODO: throw new Error("Refresh token id is not initial anymore even though no token was retrieved");
        }
        if (activeLogin.expires != null && activeLogin.expires <= new Date()) {
            throw new Error("Active login expired");
        }
        if (activeLogin.expires == null) {
            activeLogin.expires = new Date(Date.now() + expiresIn);
        }
        const codeJwtId = ++activeLogin.nextExpectedRefreshTokenNumber;

        req.internal.append({ activeLogin: await this.activeLoginService.save(activeLogin) });

        return codeJwtId;
    }

    private async generateCode(req: Request, clientId: string, scope: TokenScope[], pkce: boolean): Promise<string> {
        const activeLogin = req.internal.tryActiveLogin();
        try {
            const expiresIn = parseInt(process.env.GROPIUS_OAUTH_CODE_EXPIRATION_TIME_MS, 10);
            const codeJwtId = await this.assignActiveLoginToClient(req, expiresIn);
            const token = await this.tokenService.signActiveLoginCode(
                activeLogin.id,
                clientId,
                codeJwtId,
                scope,
                expiresIn,
                pkce ? req.internal.getRequest().codeChallenge : undefined,
            );
            this.logger.debug("Created token");
            return token;
        } catch (err: any) {
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

    async use(req: Request, res: Response, next: NextFunction) {
        // Check if middleware is enabled
        if (!req.flow.middlewares.code) return next();

        const activeLogin = req.internal.tryActiveLogin();
        const request = req.internal.getRequest();

        if (!activeLogin) {
            throw new OAuthHttpException("server_error", "No active login");
        }
        const userLoginData = await activeLogin.loginInstanceFor;
        if (request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)) {
            if (userLoginData.state === LoginState.WAITING_FOR_REGISTER) {
                await this.redirectWithCode(req, res);
            } else {
                throw new OAuthHttpException("invalid_request", "Login is not in register state");
            }
        } else {
            if (userLoginData.state === LoginState.WAITING_FOR_REGISTER) {
                const strategy = req.internal.getStrategy();
                const authState = req.internal.getAuthState();

                const encodedState = encodeURIComponent(this.stateJwtService.sign({ request, authState }));
                const token = await this.generateCode(
                    req,
                    "login-auth-client",
                    [TokenScope.LOGIN_SERVICE_REGISTER],
                    false,
                );
                const suggestions = await this.getDataSuggestions(userLoginData, strategy);
                const suggestionQuery = `&email=${encodeURIComponent(
                    suggestions.email ?? "",
                )}&username=${encodeURIComponent(suggestions.username ?? "")}&displayName=${encodeURIComponent(
                    suggestions.displayName ?? "",
                )}&forceSuggestedUsername=${strategy.forceSuggestedUsername}`;
                const url = `auth/flow/register?code=${token}&state=${encodedState}` + suggestionQuery;
                res.redirect(combineURL(url, process.env.GROPIUS_ENDPOINT).toString());
            } else {
                await this.redirectWithCode(req, res);
            }
        }
    }

    private async redirectWithCode(req: Request, res: Response) {
        const request = req.internal.getRequest();
        const client = req.internal.getClient();

        const url = new URL(request.redirect);
        const token = await this.generateCode(req, client.id, request.scope, true);
        url.searchParams.append("code", token);
        url.searchParams.append("state", request.state ?? "");
        res.redirect(url.toString());
    }
}

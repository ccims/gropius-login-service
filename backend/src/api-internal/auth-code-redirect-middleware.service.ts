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
export class CodeRedirectMiddleware implements NestMiddleware {
    private readonly logger = new Logger(CodeRedirectMiddleware.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly activeLoginService: ActiveLoginService,
        @Inject("StateJwtService")
        private readonly stateJwtService: JwtService,
        private readonly userService: LoginUserService,
    ) {}

    // TODO: this needs to be adapted to the "automatic login thing"
    private async assignActiveLoginToClient(req: Request, expiresIn: number): Promise<number> {
        const activeLogin = req.context.getActiveLogin();

        if (!activeLogin.isValid) {
            // TODO: throw new Error("Active login invalid");
        }

        // if the login service handles the registration, two tokens were already generated: the code and the access token
        if (activeLogin.nextExpectedRefreshTokenNumber != ActiveLogin.LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIEVED) {
            // TODO: throw new Error("Refresh token id is not initial anymore even though no token was retrieved");
        }
        if (activeLogin.expires != null && activeLogin.expires <= new Date()) {
            // TODO: throw new Error("Active login expired");
        }
        if (activeLogin.expires == null) {
            activeLogin.expires = new Date(Date.now() + expiresIn);
        }
        const codeJwtId = ++activeLogin.nextExpectedRefreshTokenNumber;

        req.context.setActiveLogin(await this.activeLoginService.save(activeLogin));

        return codeJwtId;
    }

    private async generateCode(req: Request, clientId: string, scope: TokenScope[]): Promise<string> {
        try {
            const activeLogin = req.context.getActiveLogin();
            const expiresIn = parseInt(process.env.GROPIUS_OAUTH_CODE_EXPIRATION_TIME_MS, 10);
            const codeJwtId = await this.assignActiveLoginToClient(req, expiresIn);
            const token = await this.tokenService.signActiveLoginCode(
                activeLogin.id,
                clientId,
                codeJwtId,
                scope,
                expiresIn,
                req.context.getRequest().codeChallenge,
            );
            return token;
        } catch (err: any) {
            this.logger.warn(err);
            throw new OAuthHttpException("server_error", "Could not generate code for response");
        }
    }

    /**
     * Return username, display name and email suggestions for registering a user
     */
    private async getDataSuggestions(loginData: UserLoginData, strategy: Strategy): Promise<UserDataSuggestion> {
        const initial = strategy.getUserDataSuggestion(loginData);
        const suggestions: UserDataSuggestion = {};

        // TODO: validate email?!
        suggestions.email = initial.email;

        if (initial.username) {
            const exists = await this.userService.exists({ where: { username: initial.username } });
            if (!exists) {
                suggestions.username = initial.username;
            }
        }

        suggestions.displayName = initial.displayName ?? suggestions.username;

        return suggestions;
    }

    async use(req: Request, res: Response, next: NextFunction) {
        // TODO: this
        if (!req.context.isAuthenticated() && !req.context.tryActiveLoginId()) {
            this.logger.log("Skipping auth core redirect middleware since not authenticated");
            return next();
        }

        const userLoginData = await req.context.getActiveLogin().loginInstanceFor;
        const request = req.context.getRequest();

        // CASE: link additional account
        if (request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)) {
            if (userLoginData.state !== LoginState.VALID) {
                throw new OAuthHttpException("invalid_request", "Login is not valid");
            }
            // TODO: this will auto login ...
            return this.redirectWithCode(req, res);
        }

        // CASE: registration
        if (userLoginData.state === LoginState.WAITING_FOR_REGISTER) {
            const strategy = req.context.getStrategy();

            const url = combineURL(`auth/flow/register`, process.env.GROPIUS_ENDPOINT);

            const suggestions = await this.getDataSuggestions(userLoginData, strategy);
            if (suggestions.email) url.searchParams.append("email", suggestions.email);
            if (suggestions.username) url.searchParams.append("username", suggestions.username);
            if (suggestions.displayName) url.searchParams.append("displayName", suggestions.displayName);
            if (strategy.forceSuggestedUsername)
                url.searchParams.append("forceSuggestedUsername", String(strategy.forceSuggestedUsername));

            return res.redirect(url.toString());
        }

        // CASE: login
        return this.redirectWithCode(req, res);
    }

    private async redirectWithCode(req: Request, res: Response) {
        const request = req.context.getRequest();
        const client = req.context.getClient();

        const url = new URL(request.redirect);
        const token = await this.generateCode(req, client.id, request.scope);
        url.searchParams.append("code", token);
        url.searchParams.append("state", request.state ?? "");

        // Update flow
        req.context.setFinished(req.body.flow);

        res.redirect(url.toString());
    }
}

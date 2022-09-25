import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenService } from "src/backend-services/token.service";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { AuthClientService } from "src/model/services/auth-client.service";
import { AuthStateData } from "../strategies/AuthResult";
import { OauthServerStateData } from "./oauth-autorize.middleware";

@Injectable()
export class OauthRedirectMiddleware implements NestMiddleware {
    private readonly logger = new Logger(OauthRedirectMiddleware.name);
    constructor(
        private readonly tokenService: TokenService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
    ) {}

    private handleErrorCases(state: (AuthStateData & OauthServerStateData) | undefined | null, url: URL): boolean {
        const errorMessage = state?.authErrorMessage;
        if (errorMessage) {
            url.searchParams.append("error", encodeURIComponent(state.authErrorType || "invalid_request"));
            url.searchParams.append(
                "error_description",
                encodeURIComponent(state.authErrorMessage?.replace(/[^\x20-\x21\x23-\x5B\x5D-\x7E]/g, "")),
            );
            return true;
        } else if (state == undefined || state == null) {
            url.searchParams.append("error", "server_error");
            url.searchParams.append(
                "error_description",
                encodeURIComponent("State of request was lost. Internal server error"),
            );
            return true;
        } else if (!state.activeLogin) {
            url.searchParams.append("error", "server_error");
            url.searchParams.append(
                "error_description",
                encodeURIComponent("Login information was lost. Internal server error"),
            );
        } else if (!state.client?.id && !state.clientId) {
            url.searchParams.append("error", "server_error");
            url.searchParams.append(
                "error_description",
                encodeURIComponent("Client id information was lost. Internal server error"),
            );
        }
        return false;
    }

    private async assignActiveLoginToClient(
        state: AuthStateData & OauthServerStateData,
        expiresIn: number,
    ): Promise<number> {
        if (typeof state.activeLogin == "string") {
            state.activeLogin = await this.activeLoginService.findOneByOrFail({
                id: state.activeLogin,
            });
        }
        if (!state.client && state.clientId) {
            state.client = await this.authClientService.findOneByOrFail({
                id: state.clientId,
            });
        }
        if (!state.activeLogin.isValid) {
            throw new Error("Active login invalid");
        }
        if (state.activeLogin.nextExpectedRefreshTokenNumber != ActiveLogin.LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIVED) {
            throw new Error("Refresh token id is not initial anymore even though no token was retrieved");
        }
        if (state.activeLogin.expires != null && state.activeLogin.expires <= new Date()) {
            throw new Error("Active login expired");
        }
        state.activeLogin.createdByClient = Promise.resolve(state.client);
        state.activeLogin.expires = new Date(Date.now() + expiresIn);
        const codeJwtId = ++state.activeLogin.nextExpectedRefreshTokenNumber;

        state.activeLogin = await this.activeLoginService.save(state.activeLogin);
        state.client = await this.authClientService.findOneBy({
            id: state.client.id,
        });

        return codeJwtId;
    }

    private async generateCode(state: AuthStateData & OauthServerStateData, url: URL) {
        const activeLogin = state?.activeLogin;
        try {
            const expiresIn = parseInt(process.env.GROPIUS_OAUTH_CODE_EXPIRATION_TIME_MS, 10);
            const codeJwtId = await this.assignActiveLoginToClient(state, expiresIn);
            const token = await this.tokenService.signActiveLoginCode(
                typeof activeLogin == "string" ? activeLogin : activeLogin.id,
                state.clientId || state.client.id,
                codeJwtId,
                expiresIn,
            );
            url.searchParams.append("code", token);
            this.logger.debug("Created token", url.searchParams);
            if (state.state) {
                url.searchParams.append("state", state.state);
            }
        } catch (err) {
            this.logger.warn(err);
            url.searchParams.append("error", "server_error");
            url.searchParams.append("error_description", encodeURIComponent("Could not generate code for response"));
        }
    }

    async use(req: Request, res: Response, next: () => void) {
        const state: OauthServerStateData = res.locals.state || {};
        if (!state.redirect) {
            throw new HttpException("No redirect address in state for request", HttpStatus.BAD_REQUEST);
        }
        const url = new URL(state.redirect);

        const hadErrors = this.handleErrorCases(res.locals?.state, url);
        if (!hadErrors) {
            await this.generateCode(res.locals?.state, url);
        }
        res.status(302).setHeader("Location", url.toString()).setHeader("Content-Length", 0).end();
    }
}

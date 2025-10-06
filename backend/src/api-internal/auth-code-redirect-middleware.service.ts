import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "src/api-oauth/OAuthHttpException";

@Injectable()
export class CodeRedirectMiddleware implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly activeLoginService: ActiveLoginService,
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

    async use(req: Request, res: Response, next: NextFunction) {
        // TODO: this
        if (!req.context.isAuthenticated() && !req.context.tryActiveLoginId()) {
            this.logger.log("Skipping auth core redirect middleware since not authenticated");
            return next();
        }

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

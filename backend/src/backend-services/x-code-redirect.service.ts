import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "src/api-oauth/OAuthHttpException";
import { AuthClientService } from "../model/services/auth-client.service";

@Injectable()
export class CodeRedirectService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
    ) {}

    private async assignActiveLoginToClient(
        req: Request,
        activeLogin: ActiveLogin,
        expiresIn: number,
    ): Promise<number> {
        if (!activeLogin.isValid) {
            throw new Error("Active login invalid");
        }

        // if the login service handles the registration, two tokens were already generated: the code and the access token
        if (activeLogin.nextExpectedRefreshTokenNumber != ActiveLogin.LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIEVED) {
            // TODO: this needs to be adapted to the "automatic login thing"?!
            // throw new Error("Refresh token id is not initial anymore even though no token was retrieved");
        }
        if (activeLogin.isExpired) {
            throw new Error("Active login expired");
        }
        if (activeLogin.expires == null) {
            activeLogin.expires = new Date(Date.now() + expiresIn);
        }
        const codeJwtId = ++activeLogin.nextExpectedRefreshTokenNumber;

        await this.activeLoginService.save(activeLogin);

        return codeJwtId;
    }

    private async generateCode(req: Request, clientId: string, scope: TokenScope[]): Promise<string> {
        try {
            const activeLogin = await this.activeLoginService.findOneByOrFail({
                id: req.context.flow.getActiveLoginId(),
            });
            const expiresIn = parseInt(process.env.GROPIUS_OAUTH_CODE_EXPIRATION_TIME_MS, 10);
            const codeJwtId = await this.assignActiveLoginToClient(req, activeLogin, expiresIn);
            const token = await this.tokenService.signActiveLoginCode(
                activeLogin.id,
                clientId,
                codeJwtId,
                scope,
                expiresIn,
                req.context.flow.getRequest().codeChallenge,
            );
            return token;
        } catch (err: any) {
            this.logger.warn(err);
            throw new OAuthHttpException("server_error", "Could not generate code for response");
        }
    }

    async use(req: Request, res: Response) {
        const request = req.context.flow.getRequest();
        const client = await this.authClientService.findAuthClient(request.clientId);

        const url = new URL(request.redirect);
        const token = await this.generateCode(req, client.id, request.scope);
        url.searchParams.append("code", token);
        url.searchParams.append("state", request.state ?? "");

        // Update flow
        req.context.flow.drop();

        res.redirect(url.toString());
    }
}

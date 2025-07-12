import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OAuthHttpException } from "./OAuthHttpException";
import { TokenService } from "src/backend-services/token.service";
import { AuthClientService } from "src/model/services/auth-client.service";

@Injectable()
export class OAuthAuthorizeValidateMiddleware implements NestMiddleware {
    constructor(
        private readonly tokenService: TokenService,
        private readonly authClientService: AuthClientService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const client = await this.authClientService.findAuthClient(res.state.request.clientId);
            res.appendState({ client });
        } catch {}
        if (!res.state.client || !res.state.client.isValid) {
            throw new OAuthHttpException("invalid_client", "Client unknown or unauthorized");
        }
        if (res.state.request.responseType !== "code") {
            throw new OAuthHttpException("unsupported_response_type", "response_type must be set to 'code'");
        }
        if (!res.state.request.redirect || !res.state.client.redirectUrls.includes(res.state.request.redirect)) {
            throw new OAuthHttpException("invalid_request", "Redirect URL not allowed");
        }
        try {
            this.tokenService.verifyScope(res.state.request.scope);
        } catch (error) {
            throw new OAuthHttpException("invalid_scope", error.message);
        }
        if (res.state.request.codeChallengeMethod !== "S256") {
            throw new OAuthHttpException("invalid_request", "Only S256 code challenge method is supported");
        }
        if (!res.state.request.codeChallenge) {
            throw new OAuthHttpException("invalid_request", "Code challenge required");
        }
        next();
    }
}

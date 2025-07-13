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
        const request = req.internal.getRequest();

        try {
            const client = await this.authClientService.findAuthClient(request.clientId);
            req.internal.append({ client });
        } catch {}
        const client = req.internal.tryClient();
        if (!client || !client.isValid) {
            throw new OAuthHttpException("invalid_client", "Client unknown or unauthorized");
        }

        if (request.responseType !== "code") {
            throw new OAuthHttpException("unsupported_response_type", "response_type must be set to 'code'");
        }

        if (!request.redirect || !client.redirectUrls.includes(request.redirect)) {
            throw new OAuthHttpException("invalid_request", "Redirect URL not allowed");
        }

        try {
            this.tokenService.verifyScope(request.scope);
        } catch (error: any) {
            throw new OAuthHttpException("invalid_scope", error.message);
        }

        if (request.codeChallengeMethod !== "S256") {
            throw new OAuthHttpException("invalid_request", "Only S256 code challenge method is supported");
        }

        if (!request.codeChallenge) {
            throw new OAuthHttpException("invalid_request", "Code challenge required");
        }

        if (request.prompt && request.prompt !== "consent") {
            throw new OAuthHttpException("invalid_request", 'Only "consent" prompt is supported');
        }

        next();
    }
}

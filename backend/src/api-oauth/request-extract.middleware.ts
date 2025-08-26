import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OAuthAuthorizeRequest } from "./OAuthAuthorizeServerState";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { EncryptionService } from "../backend-services/encryption.service";
import { OAuthHttpException } from "./OAuthHttpException";
import { AuthClientService } from "../model/services/auth-client.service";

@Injectable()
export class RequestExtractMiddleware implements NestMiddleware {
    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly tokenService: TokenService,
        private readonly authClientService: AuthClientService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const codeChallenge = req.query.code_challenge as string | undefined;
        if (!codeChallenge) {
            throw new OAuthHttpException("invalid_request", "Code challenge required");
        }
        if (!/^([a-zA-Z0-9.\-_~]){43,128}$/.test(codeChallenge)) {
            throw new OAuthHttpException("invalid_request", "Code challenge must be between 43 and 128 characters");
        }

        const unsafe: OAuthAuthorizeRequest = {
            state: req.query.state as string,
            redirect: req.query.redirect_uri as string,
            clientId: req.query.client_id as string,
            scope: (req.query.scope as string).split(" ").filter((s) => s.length > 0) as TokenScope[],
            codeChallenge: this.encryptionService.encrypt(codeChallenge),
            codeChallengeMethod: req.query.code_challenge_method as string,
            responseType: req.query.response_type as "code",
            prompt: req.query.prompt as "consent",
        };

        const client = await this.authClientService.findAuthClient(unsafe.clientId);
        if (!client || !client.isValid) {
            throw new OAuthHttpException("invalid_client", "Client unknown or unauthorized");
        }

        if (unsafe.responseType !== "code") {
            throw new OAuthHttpException("unsupported_response_type", "response_type must be set to 'code'");
        }

        if (!unsafe.redirect || !client.redirectUrls.includes(unsafe.redirect)) {
            throw new OAuthHttpException("invalid_request", "Redirect URL not allowed");
        }

        try {
            this.tokenService.verifyScope(unsafe.scope);
        } catch (error: any) {
            throw new OAuthHttpException("invalid_scope", error.message);
        }

        if (unsafe.codeChallengeMethod !== "S256") {
            throw new OAuthHttpException("invalid_request", "Only S256 code challenge method is supported");
        }

        if (!unsafe.codeChallenge) {
            throw new OAuthHttpException("invalid_request", "Code challenge required");
        }

        if (unsafe.prompt && unsafe.prompt !== "consent") {
            throw new OAuthHttpException("invalid_request", 'Only "consent" prompt is supported');
        }

        req.context.setClient(client);
        req.context.setRequest(unsafe);

        next();
    }
}

import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { OAuthHttpException } from "../errors/OAuthHttpException";
import { OAuthAuthorizeRequest } from "../api-oauth/types";
import { TokenScope, TokenService } from "./token.service";
import { EncryptionService } from "./encryption.service";
import { AuthClientService } from "../model/services/auth-client.service";

@Injectable()
export class RequestExtractService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly tokenService: TokenService,
        private readonly authClientService: AuthClientService,
    ) {}

    /**
     * Extract and validate OAuth authorize request
     */
    async use(req: Request, res: Response) {
        const codeChallenge = req.query.code_challenge as string | undefined;
        if (!codeChallenge) {
            throw new OAuthHttpException("invalid_request", "Code challenge required");
        }
        if (!/^([a-zA-Z0-9.\-_~]){43,128}$/.test(codeChallenge)) {
            throw new OAuthHttpException("invalid_request", "Code challenge must be between 43 and 128 characters");
        }

        const request: OAuthAuthorizeRequest = {
            state: req.query.state as string,
            redirect: req.query.redirect_uri as string,
            clientId: req.query.client_id as string,
            scope: (req.query.scope as string).split(" ").filter((s) => s.length > 0) as TokenScope[],
            codeChallenge: this.encryptionService.encrypt(codeChallenge),
            codeChallengeMethod: req.query.code_challenge_method as string,
            responseType: req.query.response_type as "code",
        };

        const client = await this.authClientService.findAuthClient(request.clientId);
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

        return request;
    }
}

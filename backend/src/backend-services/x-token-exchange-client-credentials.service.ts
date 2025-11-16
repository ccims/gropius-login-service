import { Injectable, Logger } from "@nestjs/common";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { Request, Response } from "express";
import { TokenService } from "src/backend-services/token.service";
import { OAuthHttpException } from "../errors/OAuthHttpException";
import { OauthTokenResponse } from "../api-oauth/types";

@Injectable()
export class TokenExchangeClientCredentialsService {
    private readonly logger = new Logger(TokenExchangeClientCredentialsService.name);

    constructor(private readonly tokenService: TokenService) {}

    /**
     * Exchange client credentials for access token
     */
    async use(req: Request, res: Response, client: AuthClient): Promise<OauthTokenResponse> {
        if (!client.requiresSecret) {
            throw new OAuthHttpException("invalid_client", "Client does not support client credentials flow");
        }

        const scope = req.body.scope?.split(" ") ?? client.validScopes;
        for (const requestedScope of scope) {
            if (!client.validScopes.includes(requestedScope)) {
                throw new OAuthHttpException("invalid_scope", "Requested scope not valid for client");
            }
        }

        const tokenExpiresInMs: number = parseInt(process.env.GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS, 10);
        const user = await client.clientCredentialFlowUser;
        if (!user) {
            throw new OAuthHttpException("invalid_client", "Client does not support client credentials flow");
        }

        const accessToken = await this.tokenService.signAccessToken(user, scope, tokenExpiresInMs);

        return {
            access_token: accessToken,
            token_type: "bearer",
            expires_in: Math.floor(tokenExpiresInMs / 1000),
            scope: scope.join(" "),
        };
    }
}

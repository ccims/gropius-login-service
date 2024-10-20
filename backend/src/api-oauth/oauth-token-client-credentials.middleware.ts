import { Injectable, Logger } from "@nestjs/common";
import { StateMiddleware } from "./StateMiddleware";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { Request, Response } from "express";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { OAuthTokenResponseDto } from "./dto/oauth-token-response.dto";
import { OAuthHttpException } from "./OAuthHttpException";

@Injectable()
export class OAuthTokenClientCredentialsMiddleware extends StateMiddleware<{ client: AuthClient }> {
    private readonly logger = new Logger(OAuthTokenClientCredentialsMiddleware.name);
    constructor(private readonly tokenService: TokenService) {
        super();
    }

    private async createAccessToken(currentClient: AuthClient, scope: TokenScope[]): Promise<OAuthTokenResponseDto> {
        const tokenExpiresInMs: number = parseInt(process.env.GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS, 10);
        const user = await currentClient.clientCredentialFlowUser;
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

    private async createResponse(client: AuthClient, scope: TokenScope[]): Promise<OAuthTokenResponseDto> {
        for (const requestedScope of scope) {
            if (!client.validScopes.includes(requestedScope)) {
                throw new OAuthHttpException("invalid_scope", "Requested scope not valid for client");
            }
        }
        return await this.createAccessToken(client, scope);
    }

    protected async useWithState(
        req: Request,
        res: Response,
        state: { client: AuthClient } & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const currentClient = state.client;
        if (!currentClient.requiresSecret) {
            throw new OAuthHttpException("invalid_client", "Client does not support client credentials flow");
        }
        const scope = req.body.scope?.split(" ") ?? currentClient.validScopes;
        const response = await this.createResponse(currentClient, scope);
        res.json(response);
    }
}

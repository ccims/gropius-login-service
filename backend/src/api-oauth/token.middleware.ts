import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { AuthClientService } from "src/model/services/auth-client.service";
import { OAuthHttpException } from "./OAuthHttpException";
import { TokenExchangeAuthorizationCodeService } from "./token-exchange-authorization-code.service";
import { TokenExchangeClientCredentialsService } from "./token-exchange-client-credentials.service";

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    private readonly logger = new Logger(TokenMiddleware.name);

    constructor(
        private readonly authClientService: AuthClientService,
        private readonly authorizationCodeService: TokenExchangeAuthorizationCodeService,
        private readonly clientCredentialsService: TokenExchangeClientCredentialsService,
    ) {}

    private async getClient(req: Request): Promise<AuthClient | undefined> {
        let clientId: string;
        let clientSecret: string | undefined;

        const header = req.headers["authorization"];
        if (header && header.startsWith("Basic ")) {
            const clientIdSecret = Buffer.from(header.substring(6), "base64")
                ?.toString("utf-8")
                ?.split(":")
                ?.map((text) => decodeURIComponent(text));

            if (clientIdSecret && clientIdSecret.length == 2) {
                clientId = clientIdSecret[0];
                clientSecret = clientIdSecret[1];
            }
        }

        if (req.body.client_id) {
            clientId = req.body.client_id;
            clientSecret = req.body.client_secret;
        }

        const client = await this.authClientService.findAuthClient(clientId);
        if (!client) return;
        if (!client.isValid) return;
        if (!client.requiresSecret) return client;

        const authenticated = client.verifySecret(clientSecret);
        if (authenticated) return client;
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const client = await this.getClient(req);
        if (!client) {
            throw new OAuthHttpException("unauthorized_client", "Unknown client or invalid client credentials");
        }

        const handlers = [this.authorizationCodeService, this.clientCredentialsService];
        const handler = handlers.find((it) => it.supportedGrantTypes.includes(req.body.grant_type));
        if (!handler) throw new OAuthHttpException("unsupported_grant_type", "No grant_type given or unsupported type");

        const response = await handler.handle(req, res, client);
        return res.json(response);
    }
}

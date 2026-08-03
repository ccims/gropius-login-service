import { Controller, Post, Req, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/util/openapi-tag";
import { Request, Response } from "express";
import { OAuthHttpException } from "../errors/OAuthHttpException";
import { AuthClient } from "../model/postgres/AuthClient.entity";
import { AuthClientService } from "../model/services/auth-client.service";
import { TokenExchangeAuthorizationCodeService } from "../backend-services/x-token-exchange-authorization-code.service";
import { TokenExchangeClientCredentialsService } from "../backend-services/x-token-exchange-client-credentials.service";
import { OauthTokenResponse } from "./types";
import { TokenExchangeRefreshTokenService } from "../backend-services/x-token-exchange-refresh-token.service";
import { AuthRateLimit } from "../util/AuthRateLimit.decorator";

@Controller()
@ApiTags(OpenApiTag.OAUTH_API)
export class TokenController {
    constructor(
        private readonly authClientService: AuthClientService,
        private readonly authorizationCodeService: TokenExchangeAuthorizationCodeService,
        private readonly clientCredentialsService: TokenExchangeClientCredentialsService,
        private readonly refreshTokenService: TokenExchangeRefreshTokenService,
    ) {}

    @Post("token")
    @AuthRateLimit()
    @ApiOperation({ summary: "Token OAuth Endpoint" })
    @ApiOkResponse({ type: OauthTokenResponse })
    async token(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<OauthTokenResponse> {
        const service = this.getService(req);
        if (!service) {
            throw new OAuthHttpException("unauthorized_client", "Unknown client or invalid client credentials");
        }

        const client = await this.getClient(req);
        if (!client) {
            throw new OAuthHttpException("unauthorized_client", "Unknown client or invalid client credentials");
        }

        return service.use(req, res, client);
    }

    private getService(req: Request) {
        switch (req.body.grant_type) {
            case "authorization_code":
                return this.authorizationCodeService;
            case "refresh_token":
                return this.refreshTokenService;
            case "client_credentials":
                return this.clientCredentialsService;
        }
    }

    private async getClient(req: Request): Promise<AuthClient | undefined> {
        let clientId: string | undefined;
        let clientSecret: string | undefined;

        const header = req.headers["authorization"];
        const usesBasicAuth = !!header && header.startsWith("Basic ");
        if (usesBasicAuth) {
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
            // RFC 6749 section 2.3 permits exactly one authentication method per request.
            // Previously the body silently overrode the header, so a request authenticated via
            // Basic could be downgraded to a body client_id carrying no secret at all.
            if (usesBasicAuth) {
                throw new OAuthHttpException(
                    "invalid_request",
                    "Use either HTTP Basic authentication or request body parameters, not both",
                );
            }
            clientId = req.body.client_id;
            clientSecret = req.body.client_secret;
        }

        if (typeof clientId !== "string" || clientId.length == 0) {
            return;
        }

        const client = await this.authClientService.findAuthClient(clientId);
        if (!client) return;
        if (!client.isValid) return;
        if (!client.requiresSecret) return client;

        const authenticated = await client.verifySecret(clientSecret);
        if (authenticated) return client;
    }
}

import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { AuthClientService } from "src/model/services/auth-client.service";
import * as bcrypt from "bcrypt";
import { OAuthHttpException } from "./OAuthHttpException";
import { OAuthTokenAuthorizationCodeMiddleware } from "./oauth-token-authorization-code.middleware";
import { OAuthTokenClientCredentialsMiddleware } from "./oauth-token-client-credentials.middleware";

@Injectable()
export class OauthTokenMiddleware implements NestMiddleware {
    private readonly logger = new Logger(OauthTokenMiddleware.name);

    constructor(
        private readonly authClientService: AuthClientService,
        private readonly oauthTokenAuthorizationCodeMiddleware: OAuthTokenAuthorizationCodeMiddleware,
        private readonly oauthTokenClientCredentialsMiddleware: OAuthTokenClientCredentialsMiddleware,
    ) {}

    private async checkGivenClientSecretValidOrNotRequired(client: AuthClient, givenSecret?: string): Promise<boolean> {
        if (!client.requiresSecret && (!givenSecret || givenSecret.length == 0)) {
            return true;
        }
        const hasCorrectClientSecret = (
            await Promise.all(
                client.clientSecrets.map((hashedSecret) =>
                    bcrypt.compare(givenSecret, hashedSecret.substring(hashedSecret.indexOf(";") + 1)),
                ),
            )
        ).includes(true);
        if (hasCorrectClientSecret) {
            return true;
        }
        return false;
    }

    /**
     * Performs the OAuth client authentication by checking the given client_id and client_secret
     * in the Authorization header and in the body (both allowed according to OAuth spec).
     *
     * Flag can be set to return any client without secrets if desired to allow logins without client
     * @param req The request object
     * @returns The auth client that requested (or any without secret if flag ist set)
     *  or `null` if credentials invalid or none given
     */
    private async getCallingClient(req: Request): Promise<AuthClient | null> {
        let clientId: string;
        let clientSecret: string | undefined;

        const auth_head = req.headers["authorization"];
        if (auth_head && auth_head.startsWith("Basic ")) {
            const clientIdSecret = Buffer.from(auth_head.substring(6), "base64")
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
        if (client && client.isValid) {
            if (await this.checkGivenClientSecretValidOrNotRequired(client, clientSecret)) {
                return client;
            }
        }

        return null;
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const grant_type = req.body.grant_type;

        const client = await this.getCallingClient(req);
        if (!client) {
            throw new OAuthHttpException("unauthorized_client", "Unknown client or invalid client credentials");
        }
        req.internal.append({ client });

        switch (grant_type) {
            case "refresh_token":
                return this.oauthTokenAuthorizationCodeMiddleware.use(req, res, next);
            case "authorization_code":
                return this.oauthTokenAuthorizationCodeMiddleware.use(req, res, next);
            case "client_credentials":
                return this.oauthTokenClientCredentialsMiddleware.use(req, res, next);
            default:
                throw new OAuthHttpException("unsupported_grant_type", "No grant_type given or unsupported type");
        }
    }
}

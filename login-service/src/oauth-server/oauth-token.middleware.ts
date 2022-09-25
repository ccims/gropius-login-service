import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { AuthClientService } from "src/model/services/auth-client.service";
import { StrategiesMiddleware } from "src/strategies/strategies.middleware";
import { StrategiesService } from "src/model/services/strategies.service";
import { TokenAuthorizationCodeMiddleware } from "./token-authorization-code.middleware";
import * as bcrypt from "bcrypt";
import { ensureState } from "src/strategies/utils";
import { OauthServerStateData } from "./oauth-autorize.middleware";
import { PostCredentialsMiddleware } from "./post-credentials.middleware";
import { OauthHttpException } from "./OauthHttpException";

@Injectable()
export class OauthTokenMiddleware implements NestMiddleware {
    constructor(
        private readonly tokenService: TokenService,
        private readonly authClientService: AuthClientService,
        private readonly tokenResponseCodeMiddleware: TokenAuthorizationCodeMiddleware,
        private readonly strategiesMiddleware: StrategiesMiddleware,
        private readonly postCredentialsMiddleware: PostCredentialsMiddleware,
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

    private async getCallingClient(req: Request): Promise<AuthClient | null> {
        const auth_head = req.headers["authorization"];
        if (auth_head && auth_head.startsWith("Basic ")) {
            const clientIdSecret = Buffer.from(auth_head.substring(6), "base64")
                ?.toString("utf-8")
                ?.split(":")
                ?.map((text) => decodeURIComponent(text));

            if (clientIdSecret && clientIdSecret.length == 2) {
                const client = await this.authClientService.findOneBy({
                    id: clientIdSecret[0],
                });
                if (client && client.isValid) {
                    if (this.checkGivenClientSecretValidOrNotRequired(client, clientIdSecret[1])) {
                        return client;
                    }
                }
            }
        }

        const client = await this.authClientService.findOneBy({
            id: req.body.client_id,
        });
        if (client && client.isValid) {
            if (this.checkGivenClientSecretValidOrNotRequired(client, req.body.client_secret)) {
                return client;
            }
        }
        return null;
    }

    async use(req: Request, res: Response, next: () => void) {
        ensureState(res);

        const client = await this.getCallingClient(req);
        if (!client) {
            throw new OauthHttpException("unauthorized_client", "Unknown client or invalid client credentials");
        }
        (res.locals.state as OauthServerStateData).client = client;

        const grant_type = req.body.grant_type;
        switch (grant_type) {
            case "refresh_token": //Request for new token using refresh token
            //Fallthrough as resfrehsh token works the same as the initial code (both used to obtain new access token)
            case "authorization_code": //Request for token based on obtained code
                await this.tokenResponseCodeMiddleware.use(req, res, () => {
                    next();
                });
                break;
            case "password": //Request for token immediately containing username + password
            //Fallthrough to custom grant where all credentials are acceptd
            case "post_credentials": //Extension/Non standard: Request for token immediately containing credentials
                await this.postCredentialsMiddleware.use(req, res, () => {
                    next();
                });
                break;
            case "client_credentials": //Request for token for stuff on client => not supported
            default:
                throw new HttpException(
                    {
                        error: "unsupported_grant_type",
                        error_description: "No grant_type given or unsupported type",
                    },
                    HttpStatus.BAD_REQUEST,
                );
        }
    }
}

import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { AuthClientService } from "src/model/services/auth-client.service";
import { StrategiesMiddleware } from "src/strategies/strategies.middleware";
import { StrategiesService } from "src/model/services/strategies.service";
import { OAuthTokenAuthorizationCodeMiddleware } from "../api-oauth/oauth-token-authorization-code.middleware";
import * as bcrypt from "bcrypt";
import { ensureState } from "src/strategies/utils";
import { OauthServerStateData } from "./auth-autorize.middleware";
import { PostCredentialsMiddleware } from "./post-credentials.middleware";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthTokenMiddleware.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly authClientService: AuthClientService,
        private readonly tokenResponseCodeMiddleware: OAuthTokenAuthorizationCodeMiddleware,
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

    /**
     * Performs the OAuth client authentication by checking the given client_id and client_secret
     * in the Authorization header and in the body (both allowed according to OAuth spec).
     *
     * Flag can be set to return any client without secrets if desired to allow logins without client
     * @param req The request object
     * @param findAnyWithoutSecret Set to `true` to find any client that has no secret
     * => allowing for login without a known client
     * @returns The auth client that requested (or any without secret if flag ist set)
     *  or `null` if credentials invalid or none given
     */
    private async getCallingClient(req: Request, findAnyWithoutSecret = false): Promise<AuthClient | null> {
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
                return null;
            }
        }

        if (req.body.client_id) {
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

        if (findAnyWithoutSecret) {
            this.logger.log(
                "Any client password authentication is enabled. Returning any client without client secret",
            );
            const client = await this.authClientService.findOneBy({
                requiresSecret: false,
                isValid: true,
            });
            if (client && client.isValid) {
                if (this.checkGivenClientSecretValidOrNotRequired(client, "")) {
                    return client;
                }
            }
        }
        return null;
    }

    async use(req: Request, res: Response, next: () => void) {
        ensureState(res);

        const grant_type = req.body.grant_type;

        const allowNoClient: unknown = process.env.GROPIUS_ALLOW_PASSWORD_TOKEN_MODE_WITHOUT_OAUTH_CLIENT;
        const mayOmitClientId =
            (allowNoClient === true || allowNoClient === "true") &&
            (grant_type == "password" || grant_type == "post_credentials");

        const client = await this.getCallingClient(req, mayOmitClientId);
        if (!client) {
            throw new OAuthHttpException("unauthorized_client", "Unknown client or invalid client credentials");
        }
        (res.locals.state as OauthServerStateData).client = client;

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

import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { AuthClientService } from "src/model/services/auth-client.service";
import * as bcrypt from "bcrypt";
import { OAuthHttpException } from "./OAuthHttpException";
import { StateMiddleware } from "./StateMiddleware";

@Injectable()
export class OauthTokenMiddleware extends StateMiddleware<{}, { client: AuthClient }> {
    private readonly logger = new Logger(OauthTokenMiddleware.name);

    constructor(
        private readonly authClientService: AuthClientService,
    ) {
        super();
    }

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
        const auth_head = req.headers["authorization"];
        if (auth_head && auth_head.startsWith("Basic ")) {
            const clientIdSecret = Buffer.from(auth_head.substring(6), "base64")
                ?.toString("utf-8")
                ?.split(":")
                ?.map((text) => decodeURIComponent(text));

            if (clientIdSecret && clientIdSecret.length == 2) {
                const client = await this.authClientService.findAuthClient(clientIdSecret[0]);
                if (client && client.isValid) {
                    if (this.checkGivenClientSecretValidOrNotRequired(client, clientIdSecret[1])) {
                        return client;
                    }
                }
                return null;
            }
        }

        if (req.body.client_id) {
            const client = await this.authClientService.findAuthClient(req.body.client_id);
            if (client && client.isValid) {
                if (this.checkGivenClientSecretValidOrNotRequired(client, req.body.client_secret)) {
                    return client;
                }
            }
            return null;
        }

        return null;
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const grant_type = req.body.grant_type;

        const client = await this.getCallingClient(req);
        if (!client) {
            throw new OAuthHttpException("unauthorized_client", "Unknown client or invalid client credentials");
        }
        this.appendState(res, { client });

        switch (grant_type) {
            case "refresh_token": //Request for new token using refresh token
            //Fallthrough as resfresh token works the same as the initial code (both used to obtain new access token)
            case "authorization_code": //Request for token based on obtained code
                next();
                break;
            case "password": // Deprecated => not supported
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

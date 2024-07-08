import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./state.middleware";
import { OAuthAuthorizeServerStateData } from "./OAuthAuthorizeServerStateData";
import { OauthHttpException } from "./OAuthHttpException";
import { TokenService } from "src/backend-services/token.service";

@Injectable()
export class OAuthAuthorizeValidateMiddleware extends StateMiddleware<
    OAuthAuthorizeServerStateData,
    OAuthAuthorizeServerStateData
> {

    constructor(private readonly tokenService: TokenService) {
        super();
    }

    protected async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerStateData & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        if (!state.client || !state.client.isValid) {
            throw new OauthHttpException("invalid_client", "Client unknown or unauthorized");
        }
        if (state.request.responseType !== "code") {
            throw new OauthHttpException("unsupported_response_type", "response_type must be set to 'code'");
        }
        if (!state.request.redirect || !state.client.redirectUrls.includes(state.request.redirect)) {
            throw new OauthHttpException("invalid_request", "Redirect URL not allowed");
        }
        try {
            this.tokenService.verifyScope(state.request.scope);
        } catch (error) {
            throw new OauthHttpException("invalid_scope", error.message);
        }
        //TODO validate PKCE
        //TODO check if PKCE is required
        next();
    }
}

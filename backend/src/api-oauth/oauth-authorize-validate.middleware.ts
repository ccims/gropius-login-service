import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { OAuthHttpException } from "./OAuthHttpException";
import { TokenService } from "src/backend-services/token.service";

@Injectable()
export class OAuthAuthorizeValidateMiddleware extends StateMiddleware<
    OAuthAuthorizeServerState,
    OAuthAuthorizeServerState
> {

    constructor(private readonly tokenService: TokenService) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        if (!state.client || !state.client.isValid) {
            throw new OAuthHttpException("invalid_client", "Client unknown or unauthorized");
        }
        if (state.request.responseType !== "code") {
            throw new OAuthHttpException("unsupported_response_type", "response_type must be set to 'code'");
        }
        if (!state.request.redirect || !state.client.redirectUrls.includes(state.request.redirect)) {
            throw new OAuthHttpException("invalid_request", "Redirect URL not allowed");
        }
        try {
            this.tokenService.verifyScope(state.request.scope);
        } catch (error) {
            throw new OAuthHttpException("invalid_scope", error.message);
        }
        //TODO validate PKCE
        //TODO check if PKCE is required
        next();
    }
}

import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { AuthClientService } from "src/model/services/auth-client.service";
import { AuthStateData } from "../strategies/AuthResult";
import { ensureState } from "../strategies/utils";

export interface OauthServerStateData {
    state?: string;
    redirect?: string;
    clientId?: string;
    client?: AuthClient;
}

@Injectable()
export class AuthAutorizeMiddleware implements NestMiddleware {
    constructor(private readonly authClientService: AuthClientService) {}

    async use(req: Request, res: Response, next: () => void) {
        ensureState(res);
        const params = { ...req.query } as { [name: string]: string };
        const clientId = params.client_id;
        const client = await this.authClientService.findOneBy({ id: clientId });
        if (!clientId || !client || !client.isValid) {
            throw new HttpException(
                "client_id not given, not a valid client id or client invalid",
                HttpStatus.BAD_REQUEST,
            );
        }
        if (params.response_type != undefined && params.response_type !== "code") {
            (res.locals.state as AuthStateData).authErrorMessage =
                "response_type must be set to 'code'. Other flow types not supported";
            (res.locals.state as AuthStateData).authErrorType = "unsupported_response_type";
        }
        if (!!params.redirect_uri && !client.redirectUrls.includes(params.redirect_uri)) {
            throw new HttpException("Given redirect URI not valid for this client", HttpStatus.BAD_REQUEST);
        }
        const redirect = params.redirect_uri || client.redirectUrls[0];
        const state = params.state;

        ensureState(res);
        res.locals.state.state = state;
        res.locals.state.redirect = redirect;
        res.locals.state.clientId = clientId;
        next();
    }
}

import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthClientService } from "src/model/services/auth-client.service";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthAuthorizeRequest, OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthAutorizeExtractMiddleware extends StateMiddleware<{}, OAuthAuthorizeServerState> {
    constructor(
        private readonly authClientService: AuthClientService,
        private readonly jwtService: JwtService,
    ) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const newState = this.jwtService.verify<Pick<OAuthAuthorizeServerState, "request">>(req.query.state as string);
        const client = await this.authClientService.findOneBy({ id: newState.request.clientId });
        this.appendState(res, { client, ...newState });
        next();
    }
}

import { Inject, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { JwtService } from "@nestjs/jwt";
import { TokenScope } from "src/backend-services/token.service";

@Injectable()
export class AuthAuthorizeExtractMiddleware extends StateMiddleware<{}, Omit<OAuthAuthorizeServerState, "client">> {
    constructor(
        @Inject("StateJwtService")
        private readonly stateJwtService: JwtService,
    ) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const newState = this.stateJwtService.verify<Pick<OAuthAuthorizeServerState, "request">>(
            req.query.state ?? req.body.state,
        );
        this.appendState(res, {
            ...newState,
            isRegisterAdditional: newState.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER),
        });
        next();
    }
}

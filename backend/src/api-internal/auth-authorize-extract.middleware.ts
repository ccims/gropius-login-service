import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { TokenScope } from "src/backend-services/token.service";

@Injectable()
export class AuthAuthorizeExtractMiddleware extends StateMiddleware<{}, Omit<OAuthAuthorizeServerState, "client">> {
    constructor() {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const newState = { request: req.flow.getRequest() };

        this.appendState(res, {
            ...newState,
            isRegisterAdditional: newState.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER),
        });
        next();
    }
}

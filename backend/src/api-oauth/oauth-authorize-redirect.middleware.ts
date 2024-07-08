import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./state.middleware";
import { OAuthAuthorizeServerStateData } from "./OAuthAuthorizeServerStateData";
import { TokenScope } from "src/backend-services/token.service";

@Injectable()
export class OAuthAuthorizeRedirectMiddleware extends StateMiddleware<
    OAuthAuthorizeServerStateData,
    OAuthAuthorizeServerStateData
> {
    protected async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerStateData & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const target = state.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)
            ? "register-additional"
            : "login";
        const encodedState = encodeURIComponent(JSON.stringify(state.request));
        res.status(302)
            .setHeader("Location", `/auth/flow/${target}?state=${encodedState}`)
            .setHeader("Content-Length", 0)
            .end();
    }
}

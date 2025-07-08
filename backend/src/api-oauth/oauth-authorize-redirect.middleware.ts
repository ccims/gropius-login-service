import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { TokenScope } from "src/backend-services/token.service";
import { combineURL } from "src/util/combineURL";

@Injectable()
export class OAuthAuthorizeRedirectMiddleware extends StateMiddleware<
    OAuthAuthorizeServerState,
    OAuthAuthorizeServerState
> {
    constructor() {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const target = state.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)
            ? "register-additional"
            : "login";

        req.flow.setStarted(state.request);

        res.redirect(combineURL(`auth/flow/${target}`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

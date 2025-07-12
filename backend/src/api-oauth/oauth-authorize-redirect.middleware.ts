import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { TokenScope } from "src/backend-services/token.service";
import { combineURL } from "src/util/combineURL";
import { State } from "../util/State";

@Injectable()
export class OAuthAuthorizeRedirectMiddleware implements NestMiddleware {
    async use(req: Request, res: Response) {
        const target = res.state.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)
            ? "register-additional"
            : "login";

        req.flow.setStarted(res.state.request);

        res.redirect(combineURL(`auth/flow/${target}`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

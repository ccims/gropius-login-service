import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { AuthStateServerData } from "src/strategies/AuthResult";
import { combineURL } from "../util/combineURL";
import * as process from "node:process";

@Injectable()
export class AuthPromptRedirectMiddleware extends StateMiddleware {
    constructor() {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<void> {
        res.redirect(combineURL(`auth/flow/prompt`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

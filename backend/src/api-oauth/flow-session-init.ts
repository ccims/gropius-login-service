import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { AuthStateServerData } from "../strategies/AuthResult";
import { FlowSession } from "../util/FlowSession";
import { LoginUserService } from "../model/services/login-user.service";
import { now } from "../util/utils";

@Injectable()
export class FlowSessionInitMiddleware extends StateMiddleware {
    constructor(private readonly loginUserService: LoginUserService) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: AuthStateServerData & OAuthAuthorizeServerState & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        // Init flow session
        req.flow = new FlowSession(req);
        req.flow.init();

        // Check if expired
        if (req.flow.isExpired()) req.flow.regenerate();

        // Check if revoked
        if (req.flow.isAuthenticated()) {
            const loginUser = await this.loginUserService.findOneBy({ id: req.flow.getUser() });
            if (!loginUser) throw new Error("Login user not found");

            const revokedAt = loginUser.revokeTokensBefore;
            if (revokedAt) {
                if (now() > revokedAt.getTime()) throw new Error("Login user revoked tokens");
            }
        }

        next();
    }
}

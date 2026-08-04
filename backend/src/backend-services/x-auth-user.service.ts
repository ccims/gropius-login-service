import { Injectable, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { combineURL } from "../util/utils.js";
import { AuthClientService } from "../model/services/auth-client.service.js";
import { ActiveLoginService } from "../model/services/active-login.service.js";

@Injectable()
export class AuthUserService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly activeLoginService: ActiveLoginService) {}

    /**
     * Persist authenticated user from the flow into the auth context
     */
    async use(req: Request, res: Response) {
        const activeLogin = await this.activeLoginService.findOneByOrFail({
            id: req.context.flow.getActiveLoginId(),
        });
        const userLoginData = await activeLogin.loginInstanceFor;
        const loginUser = await userLoginData.user;
        if (!loginUser) throw new Error("ActiveLogin has no associated user");

        req.context.auth.setUser(loginUser, activeLogin);
    }
}

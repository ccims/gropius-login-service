import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { combineURL } from "../util/utils";
import { AuthClientService } from "../model/services/auth-client.service";
import { ActiveLoginService } from "../model/services/active-login.service";

@Injectable()
export class AuthUserService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly activeLoginService: ActiveLoginService) {}

    async use(req: Request, res: Response) {
        const activeLogin = await this.activeLoginService.findOneByOrFail({
            id: req.context.flow.getActiveLoginId(),
        });
        const userLoginData = await activeLogin.loginInstanceFor;
        const loginUser = await userLoginData.user;
        if (!loginUser) throw new Error("ActiveLogin has no associated user");

        req.context.auth.setUser(loginUser);
        req.context.auth.setUserLoginData(userLoginData);
    }
}

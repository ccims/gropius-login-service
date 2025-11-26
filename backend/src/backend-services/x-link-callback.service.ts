import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { LoginUserService } from "src/model/services/login-user.service";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { ActiveLoginService } from "../model/services/active-login.service";

@Injectable()
export class LinkCallbackService implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userService: LoginUserService,
        private readonly backendUserService: BackendUserService,
        private readonly activeLoginService: ActiveLoginService,
    ) {}

    /**
     * Link account to user
     */
    async use(req: Request, res: Response) {
        // Get login data
        const activeLogin = await this.activeLoginService.findOneByOrFail({
            id: req.context.flow.getActiveLoginId(),
        });
        const loginData = await activeLogin.loginInstanceFor;
        if (!loginData) throw new Error("Login data not found for active login");

        // Find user
        const user = await this.userService.findOneByOrFail({ id: req.context.auth.getUserId() });

        // Link accounts
        await this.backendUserService.linkAccountToUser(user, loginData);

        // Link flow finished
        req.context.flow.end();

        // Redirect to account page
        return res.redirect(`/auth/flow/account`);
    }
}

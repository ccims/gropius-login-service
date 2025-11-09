import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { Context } from "../util/Context";
import { LoginUserService } from "../model/services/login-user.service";
import { now } from "../util/utils";
import { ActiveLoginService } from "../model/services/active-login.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { LoginState } from "../model/postgres/UserLoginData.entity";

@Injectable()
export class FlowInitService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly loginUserService: LoginUserService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly authClientService: AuthClientService,
    ) {}

    async use(req: Request, res: Response) {
        // Init flow session
        req.context = new Context(req);

        try {
            // Check if auth expired
            if (req.context.auth.isExpired()) throw new Error("Auth expired");

            // Check if revoked
            if (req.context.auth.isAuthenticated()) {
                const loginUser = await this.loginUserService.findOneByOrFail({ id: req.context.auth.getUserId() });
                if (!loginUser) throw new Error("Login user not found");

                const revokedAt = loginUser.revokeTokensBefore;
                if (revokedAt && now() > revokedAt.getTime()) throw new Error("Login user revoked tokens");

                // Check active login exists
                const activeLogin = await this.activeLoginService.findOneByOrFail({
                    id: req.context.auth.getActiveLoginId(),
                });

                // Check if active login is valid
                if (!activeLogin.isValid) throw new Error("Active login invalid");

                // Check if active login expired
                if (activeLogin.isExpired) throw new Error("Active login expired");

                // Extend active login expiration
                await this.activeLoginService.extendExpiration(activeLogin);

                // Check if login data exists
                const loginData = await activeLogin.loginInstanceFor;
                if (!loginData) throw new Error("Login data not found");

                // Check if login data valid
                if (loginData.state !== LoginState.VALID) throw new Error("Login data not in valid state");
            }

            // Check flow if exists
            if (req.context.flow.exists()) {
                // Check if flow expired
                if (req.context.flow.isExpired()) req.context.flow.drop();

                // Check active login
                const activeLoginId = req.context.flow.tryActiveLoginId();
                if (activeLoginId) {
                    // Check active login exists
                    const activeLogin = await this.activeLoginService.findOneByOrFail({
                        id: req.context.flow.getActiveLoginId(),
                    });

                    // Check if active login is valid
                    if (!activeLogin.isValid) throw new Error("Active login invalid");

                    // Check if active login expired
                    if (activeLogin.isExpired) throw new Error("Active login expired");

                    // Extend active login expiration
                    await this.activeLoginService.extendExpiration(activeLogin);

                    // Check if login data exists
                    const loginData = await activeLogin.loginInstanceFor;
                    if (!loginData) throw new Error("Login data not found");
                }

                // Check client is valid
                const request = req.context.flow.tryRequest();
                if (request) {
                    const client = await this.authClientService.findAuthClient(request.clientId);
                    if (!client) throw new Error("Client not found");
                    if (!client.isValid) throw new Error("Client invalid");
                }
            }
        } catch (e: any) {
            this.logger.error(e);
            req.context.regenerate();
        }
    }
}

import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { combineURL } from "../util/utils";
import { AuthClientService } from "../model/services/auth-client.service";
import { PromptRedirectService } from "../backend-services/x-prompt-redirect.service";

// TODO: migrate
@Injectable()
export class PromptRedirectMiddleware implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly authClientService: AuthClientService,
        private readonly promptRedirectService: PromptRedirectService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Check if register additional
        if (req.context.flow.isLinkFlow()) {
            this.logger.log("Skipping prompt redirect middleware since register additional");
            return next();
        }

        // Check if middleware is enabled
        if (!req.context.auth.isAuthenticated()) {
            this.logger.log("Skipping prompt redirect middleware since not authenticated");
            return next();
        }

        const request = req.context.flow.getRequest();
        const client = await this.authClientService.findAuthClient(request.clientId);

        // Do not prompt for internal clients or if consent is already given
        if (client.isInternal || req.context.flow.didConsent()) {
            this.logger.log("Skipping prompt redirect middleware since client internal or already did consent");
            return next();
        }

        // Prompt user for consent
        return this.promptRedirectService.use(req, res);
    }
}

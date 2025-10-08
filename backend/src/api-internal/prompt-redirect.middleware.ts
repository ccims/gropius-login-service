import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { combineURL } from "../util/utils";
import { AuthClientService } from "../model/services/auth-client.service";

@Injectable()
export class PromptRedirectMiddleware implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly authClientService: AuthClientService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Check if register additional
        if (req.context.flow.isRegisterAdditional()) {
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
            req.context.flow.setPrompted(true, req.context.flow.getId());
            this.logger.log("Skipping prompt redirect middleware since client internal or already did consent");
            return next();
        }

        // Prompt user for consent
        res.redirect(combineURL(`auth/flow/prompt`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

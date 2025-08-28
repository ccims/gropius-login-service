import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { combineURL } from "../util/utils";

@Injectable()
export class PromptRedirectMiddleware implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    async use(req: Request, res: Response, next: NextFunction) {
        // Check if middleware is enabled
        if (!req.context.isAuthenticated()) {
            this.logger.log("Skipping prompt redirect middleware since not authenticated");
            return next();
        }

        // Always prompt if requested
        if (req.context.getRequest().prompt !== "consent") {
            // Do not prompt for internal clients or if consent is already given
            if (req.context.getClient().isInternal || req.context.didConsent()) {
                req.context.setPrompted(true, req.context.getFlowId());
                req.context.setFinished(req.context.getFlowId());
                this.logger.log("Skipping prompt redirect middleware since client internal or already did consent");
                return next();
            }
        }

        // Prompt user for consent
        res.redirect(combineURL(`auth/flow/prompt`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

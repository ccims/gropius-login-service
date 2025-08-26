import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { combineURL } from "../util/utils";

@Injectable()
export class AuthPromptRedirectMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        // Check if middleware is enabled
        if (!req.context.middlewares.prompt) return next();

        // Always prompt if requested
        if (req.context.getRequest().prompt !== "consent") {
            // Do not prompt for internal clients or if consent is already given
            if (req.context.getClient().isInternal || req.context.didConsent()) {
                req.context.skipPrompt();
                return next();
            }
        }

        // Prompt user for consent
        res.redirect(combineURL(`auth/flow/prompt`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

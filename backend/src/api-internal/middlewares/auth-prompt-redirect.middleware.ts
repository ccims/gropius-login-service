import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { combineURL } from "../../util/utils";

@Injectable()
export class AuthPromptRedirectMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        // Check if middleware is enabled
        if (!req.flow.middlewares.prompt) return next();

        // Do not prompt for internal clients or if consent is already given
        if (req.internal.getClient().isInternal || req.flow.didConsent()) {
            req.flow.skipPrompt();
            return next();
        }

        // Prompt user for consent
        res.redirect(combineURL(`auth/flow/prompt`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

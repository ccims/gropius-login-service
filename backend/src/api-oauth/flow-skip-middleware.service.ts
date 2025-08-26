import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class FlowSkipMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        // If authenticated, then directly go prompt screen and auth code redirect
        if (req.context.isAuthenticated()) {
            req.context.setStarted();
            req.context.setAuthenticated({
                userId: req.context.getUserId(),
                activeLoginId: req.context.getActiveLoginId(),
                externalCSRF: req.context.getExternalCSRF(),
            });
        }

        next();
    }
}

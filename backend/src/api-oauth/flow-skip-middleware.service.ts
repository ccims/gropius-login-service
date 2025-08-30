import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class FlowSkipMiddleware implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.context.isRegisterAdditional()) {
            this.logger.log("Skipping auth core redirect middleware since not authenticated");
            return next();
        }

        // If authenticated, then directly go prompt screen and auth code redirect
        if (req.context.isAuthenticated()) {
            req.context.setStarted();
            req.context.setAuthenticated({
                externalCSRF: req.context.getExternalCSRF(),
            });
        }

        next();
    }
}

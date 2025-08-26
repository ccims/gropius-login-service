import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class FlowSessionSwitchMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.context.isAuthenticated()) {
            req.context.setStarted(req.context.getRequest());
            req.context.setAuthenticated({
                userId: req.context.getUserId(),
                activeLoginId: req.context.getActiveLoginId(),
                externalCSRF: req.context.getExternalCSRF(),
            });
        } else {
            req.context.middlewares.prompt = false;
            req.context.middlewares.code = false;
            req.context.middlewares.restore = false;
        }

        next();
    }
}

import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class FlowSessionSwitchMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.flow.isAuthenticated()) {
            req.flow.setStarted(req.internal.getRequest());
            req.flow.setAuthenticated(req.flow.getUserId(), req.flow.getActiveLogin(), req.flow.getExternalCSRF());
        } else {
            req.flow.middlewares.prompt = false;
            req.flow.middlewares.code = false;
            req.flow.middlewares.restore = false;
        }

        next();
    }
}

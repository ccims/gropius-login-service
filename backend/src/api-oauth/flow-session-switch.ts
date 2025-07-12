import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class FlowSessionSwitchMiddleware implements NestMiddleware {
    constructor() {}

    async use(req: Request, res: Response, next: (error?: Error | any) => void) {
        // TODO: enable this
        const not = false;
        if (req.flow.isAuthenticated() && not) {
            req.flow.setStarted(res.state.request);
            req.flow.setAuthenticated(req.flow.getUser(), req.flow.getActiveLogin(), req.flow.getExternalFlow());
        } else {
            req.flow.middlewares.prompt = false;
            req.flow.middlewares.code = false;
            req.flow.middlewares.restore = false;
        }

        next();
    }
}

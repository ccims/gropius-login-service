import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CodeRedirectService } from "../backend-services/x-code-redirect.service";

@Injectable()
export class CodeRedirectMiddleware implements NestMiddleware {
    constructor(private readonly service: CodeRedirectService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // TODO: this
        if (!req.context.auth.isAuthenticated() && !req.context.flow.tryActiveLoginId()) {
            return next();
        }

        await this.service.use(req, res);
    }
}

import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { FlowInitService } from "../backend-services/x-flow-init.service";

// TODO: omit this
@Injectable()
export class FlowInitMiddleware implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly flowInitService: FlowInitService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            await this.flowInitService.use(req, res);
        } catch (e: any) {
            this.logger.error(e);
            req.context.regenerate();
        }

        next();
    }
}

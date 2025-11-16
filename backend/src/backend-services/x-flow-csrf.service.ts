import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { combineURL, compareTimeSafe } from "../util/utils";

@Injectable()
export class FlowCSRFService {
    private readonly logger = new Logger(this.constructor.name);

    /**
     * Check flow-bound CSRF
     */
    async use(req: Request, res: Response) {
        const found = req.body?.flow ?? req.header("x-flow-token") ?? req.query?.flow ?? req.params?.flow;
        if (!found) throw new Error("No flow-bound CSRF token provided");
        if (!compareTimeSafe(found, req.context.flow.getId()))
            throw new Error("Invalid flow-bound CSRF token provided");
    }
}

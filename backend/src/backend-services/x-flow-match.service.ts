import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { combineURL, compareTimeSafe } from "../util/utils";

@Injectable()
export class FlowMatchService {
    private readonly logger = new Logger(this.constructor.name);

    async use(req: Request, res: Response) {
        const found = req.body?.flow ?? req.header("x-flow-token") ?? req.query?.flow ?? req.params?.flow;
        if (!found) throw new Error("No Flow ID provided");
        if (!compareTimeSafe(found, req.context.flow.getId())) throw new Error("Invalid Flow ID provided");
    }
}

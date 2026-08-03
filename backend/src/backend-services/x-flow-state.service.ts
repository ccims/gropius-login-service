import { Injectable, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { combineURL, compareTimeSafe } from "../util/utils.js";
import { FlowState } from "../util/Context.js";

@Injectable()
export class FlowStateService {
    private readonly logger = new Logger(this.constructor.name);

    /**
     * Check that the flow has the expected state
     */
    async use(last: FlowState, req: Request, res: Response) {
        if (last !== req.context.flow.getState()) {
            req.context.flow.end();
            throw new Error("Invalid Flow Action");
        }
    }
}

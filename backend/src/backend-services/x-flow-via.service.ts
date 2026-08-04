import { Injectable, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { combineURL } from "../util/utils.js";
import { FlowType } from "../strategies/AuthResult.js";
import { AuthFunctionInput } from "../api-internal/types.js";

@Injectable()
export class FlowViaService {
    private readonly logger = new Logger(this.constructor.name);

    /**
     * Set the flow type and via based on the mode parameter
     */
    async use(req: Request, res: Response) {
        switch (req.params.mode) {
            case AuthFunctionInput.REGISTER:
                req.context.flow.setType(FlowType.REGISTER);
                req.context.flow.setVia("register");
                break;

            case AuthFunctionInput.REGISTER_WITH_SYNC:
                req.context.flow.setType(FlowType.REGISTER_WITH_SYNC);
                req.context.flow.setVia("register");
                break;

            case AuthFunctionInput.LOGIN:
                req.context.flow.setType(FlowType.LOGIN);
                req.context.flow.setVia("login");
                break;

            default:
                throw new Error("Invalid mode");
        }
    }
}

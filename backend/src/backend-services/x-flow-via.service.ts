import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { combineURL } from "../util/utils";
import { FlowType } from "../strategies/AuthResult";
import { AuthFunctionInput } from "../api-internal/types";

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

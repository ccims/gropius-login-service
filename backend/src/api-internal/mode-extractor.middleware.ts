import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { FlowType } from "../strategies/AuthResult";
import { AuthFunctionInput } from "./dto/auth-function.dto";

@Injectable()
export class ModeExtractorMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        let authFunction: FlowType;
        switch (req.params.mode) {
            case AuthFunctionInput.REGISTER:
                authFunction = FlowType.REGISTER;
                break;
            case AuthFunctionInput.REGISTER_WITH_SYNC:
                authFunction = FlowType.REGISTER_WITH_SYNC;
                break;
            case AuthFunctionInput.LOGIN:
                authFunction = FlowType.LOGIN;
                break;
            default:
                throw new Error("Invalid mode");
        }

        // TODO: if link, then flow.init(). otherwise, flow.assert()

        req.context.flow.init();
        req.context.flow.setType(authFunction);

        next();
    }
}

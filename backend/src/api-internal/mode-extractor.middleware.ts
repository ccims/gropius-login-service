import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { FlowType } from "../strategies/AuthResult";

@Injectable()
export class ModeExtractorMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        let authFunction: FlowType;
        switch (req.params.mode) {
            case "register":
                authFunction = FlowType.REGISTER;
                break;
            case "register-sync":
                authFunction = FlowType.REGISTER_WITH_SYNC;
                break;
            case "login":
                authFunction = FlowType.LOGIN;
                break;
            default:
                throw new Error("Invalid mode");
        }

        req.context.setFlowType(authFunction);

        next();
    }
}

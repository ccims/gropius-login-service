import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthFunction } from "../strategies/AuthResult";

@Injectable()
export class ModeExtractorMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        let authFunction: AuthFunction;
        switch (req.params.mode) {
            case "register":
                authFunction = AuthFunction.REGISTER;
                break;
            case "register-sync":
                authFunction = AuthFunction.REGISTER_WITH_SYNC;
                break;
            case "login":
                authFunction = AuthFunction.LOGIN;
                break;
            default:
                throw new Error("Invalid mode");
        }

        const authState = { function: authFunction };
        req.internal.append({ authState });
        req.session.authState = authState;

        next();
    }
}

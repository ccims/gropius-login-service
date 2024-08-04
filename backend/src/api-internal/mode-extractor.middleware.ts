import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthFunction, AuthStateServerData } from "../strategies/AuthResult";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";

@Injectable()
export class ModeExtractorMiddleware extends StateMiddleware<{}, AuthStateServerData> {
    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
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
        this.appendState(res, { authState: { function: authFunction } });
        next();
    }
}

import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { AuthFunction, AuthStateData } from "./AuthResult";
import { StrategiesService } from "../model/services/strategies.service";
import { ensureState } from "./utils";

@Injectable()
export class ModeExtractorMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: () => void) {
        ensureState(res);
        switch (req.params.mode) {
            case "register":
                (res.locals.state as AuthStateData).function = AuthFunction.REGISTER;
                break;
            case "register-sync":
                (res.locals.state as AuthStateData).function = AuthFunction.REGISTER_WITH_SYNC;
                break;
            case "login":
            default:
                (res.locals.state as AuthStateData).function = AuthFunction.LOGIN;
                break;
        }
        next();
    }
}

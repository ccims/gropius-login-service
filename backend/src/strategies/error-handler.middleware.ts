import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { AuthStateData } from "./AuthResult";
import { StrategiesService } from "../model/services/strategies.service";

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
    constructor(
        private readonly strategiesService: StrategiesService,
        private readonly strategyInstanceService: StrategyInstanceService,
        private readonly activeLoginService: ActiveLoginService,
    ) {}

    async use(req: Request, res: Response, next: () => void) {
        const errorMessage = (res.locals?.state as AuthStateData)?.authErrorMessage;
        const errorType = (res.locals?.state as AuthStateData)?.authErrorType;
        if (errorMessage || errorType) {
            if (errorType) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        error: errorType,
                        error_description: errorMessage,
                        message: errorMessage,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
            }
        } else if (res.locals?.state == undefined || res.locals?.state == null) {
            throw new HttpException("State of request was lost", HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            next();
        }
    }
}

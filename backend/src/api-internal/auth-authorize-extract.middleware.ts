import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TokenScope } from "src/backend-services/token.service";

@Injectable()
export class AuthAuthorizeExtractMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const request = req.flow.getRequest();

        res.appendState({
            request,
            isRegisterAdditional: request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER),
        });
        next();
    }
}

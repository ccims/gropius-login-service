import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OAuthAuthorizeRequest } from "./types";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { EncryptionService } from "../backend-services/encryption.service";
import { OAuthHttpException } from "./OAuthHttpException";
import { AuthClientService } from "../model/services/auth-client.service";

@Injectable()
export class RequestExtractMiddleware implements NestMiddleware {
    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly tokenService: TokenService,
        private readonly authClientService: AuthClientService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        next();
    }
}

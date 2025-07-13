import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CheckRegistrationTokenService } from "src/api-login/auth/check-registration-token.service";
import { OAuthHttpException } from "src/api-oauth/OAuthHttpException";
import { LoginUserService } from "src/model/services/login-user.service";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { SelfRegisterUserInput } from "../dto/self-register-user-input.dto";

@Injectable()
export class AuthRegisterMiddleware implements NestMiddleware {
    constructor(
        private readonly checkRegistrationTokenService: CheckRegistrationTokenService,
        private readonly userService: LoginUserService,
        private readonly backendUserService: BackendUserService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const input = req.body;
        SelfRegisterUserInput.check(input);
        const { loginData, activeLogin } = await this.checkRegistrationTokenService.getActiveLoginAndLoginDataForToken(
            input.register_token,
        );
        if (req.internal.getAuthState().activeLogin !== activeLogin.id) {
            throw new OAuthHttpException("server_error", "Invalid registration token");
        }
        if ((await this.userService.countBy({ username: input.username })) > 0) {
            throw new HttpException("Username is not available anymore", HttpStatus.BAD_REQUEST);
        }
        const newUser = await this.backendUserService.createNewUser(input, false);
        await this.backendUserService.linkAccountToUser(newUser, loginData, activeLogin);
        req.internal.append({ activeLogin, secondToken: true });
        next();
    }
}

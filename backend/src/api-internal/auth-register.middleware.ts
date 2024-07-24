import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { AuthStateServerData } from "src/strategies/AuthResult";
import { CheckRegistrationTokenService } from "src/api-login/auth/check-registration-token.service";
import { OAuthHttpException } from "src/api-oauth/OAuthHttpException";
import { LoginUserService } from "src/model/services/login-user.service";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { SelfRegisterUserInput } from "./dto/self-register-user-input.dto";

@Injectable()
export class AuthRegisterMiddleware extends StateMiddleware<
    OAuthAuthorizeServerState & AuthStateServerData,
    OAuthAuthorizeServerState & AuthStateServerData & { secondToken: boolean }
> {
    constructor(
        private readonly checkRegistrationTokenService: CheckRegistrationTokenService,
        private readonly userService: LoginUserService,
        private readonly backendUserSerivce: BackendUserService,
    ) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & AuthStateServerData & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const input = req.body;
        SelfRegisterUserInput.check(input);
        const { loginData, activeLogin } = await this.checkRegistrationTokenService.getActiveLoginAndLoginDataForToken(
            input.register_token,
        );
        if (state.authState.activeLogin !== activeLogin.id) {
            throw new OAuthHttpException("server_error", "Invalid registration token");
        }
        if ((await this.userService.countBy({ username: input.username })) > 0) {
            throw new HttpException("Username is not available anymore", HttpStatus.BAD_REQUEST);
        }
        const newUser = await this.backendUserSerivce.createNewUser(input, false);
        await this.backendUserSerivce.linkAccountToUser(newUser, loginData, activeLogin);
        this.appendState(res, { activeLogin, secondToken: true });
        next();
    }
}

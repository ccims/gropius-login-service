import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LoginUserService } from "src/model/services/login-user.service";
import { BackendUserService } from "src/backend-services/backend-user.service";
import * as Joi from "joi";
import { ActiveLoginService } from "../model/services/active-login.service";

const schema = Joi.object({
    username: Joi.string(),
    displayName: Joi.string(),
    email: Joi.string(),
    // TODO: this
    csrf: Joi.string().allow("").optional(),
});

type Data = {
    username: string;
    displayName: string;
    email: string;
};

@Injectable()
export class RegisterCallbackMiddleware implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userService: LoginUserService,
        private readonly backendUserService: BackendUserService,
        private readonly activeLoginService: ActiveLoginService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Validate input data
        const data: Data = await schema.validateAsync(req.body);

        const activeLogin = await this.activeLoginService.findOneByOrFail({
            id: req.context.auth.getActiveLoginId(),
        });
        const loginData = await activeLogin.loginInstanceFor;
        if (!loginData) throw new Error("Login data not found for active login");

        // Check if username is still available
        if ((await this.userService.countBy({ username: data.username })) > 0) {
            throw new HttpException("Username is not available anymore", HttpStatus.BAD_REQUEST);
        }

        // Redirect user to account page if register-additional
        if (req.context.flow.isRegisterAdditional()) {
            const existingUser = await this.userService.findOneByOrFail({ id: req.context.auth.getUserId() });
            await this.backendUserService.linkAccountToUser(existingUser, loginData, activeLogin);
            req.context.flow.drop();
            return res.redirect(`/auth/flow/account`);
        }

        // Create and link new user
        const newUser = await this.backendUserService.createNewUser(data, false);
        await this.backendUserService.linkAccountToUser(newUser, loginData, activeLogin);

        next();
    }
}

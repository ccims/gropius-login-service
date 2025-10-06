import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LoginUserService } from "src/model/services/login-user.service";
import { BackendUserService } from "src/backend-services/backend-user.service";
import * as Joi from "joi";

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
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Validate input data
        const data: Data = await schema.validateAsync(req.body);

        const activeLogin = req.context.getActiveLogin();
        const loginData = await activeLogin.loginInstanceFor;
        if (!loginData) throw new Error("Login data not found for active login");

        // Check if username is still available
        if ((await this.userService.countBy({ username: data.username })) > 0) {
            throw new HttpException("Username is not available anymore", HttpStatus.BAD_REQUEST);
        }

        // Redirect user to account page if register-additional
        if (req.context.isRegisterAdditional()) {
            const existingUser = req.context.getUser();
            await this.backendUserService.linkAccountToUser(existingUser, loginData, activeLogin);
            req.context.setActiveLogin(activeLogin);
            req.context.dropFlow();
            return res.redirect(`/auth/flow/account`);
        }

        // Create and link new user
        const newUser = await this.backendUserService.createNewUser(data, false);
        await this.backendUserService.linkAccountToUser(newUser, loginData, activeLogin);
        req.context.setActiveLogin(activeLogin);

        next();
    }
}

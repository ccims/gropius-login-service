import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LoginUserService } from "src/model/services/login-user.service";
import { BackendUserService } from "src/backend-services/backend-user.service";
import * as Joi from "joi";

const schema = Joi.object({
    username: Joi.string(),
    displayName: Joi.string(),
    email: Joi.string(),
    // TODO: this
    externalCSRF: Joi.string().allow("").optional(),
});

type Data = {
    username: string;
    displayName: string;
    email: string;
};

@Injectable()
export class RegisterMiddleware implements NestMiddleware {
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

        // Create and link new user
        const newUser = await this.backendUserService.createNewUser(data, false);
        await this.backendUserService.linkAccountToUser(newUser, loginData, activeLogin);
        req.context.setActiveLogin(activeLogin);

        next();
    }
}

import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { LoginUserService } from "src/model/services/login-user.service";
import { BackendUserService } from "src/backend-services/backend-user.service";
import * as Joi from "joi";
import { ActiveLoginService } from "../model/services/active-login.service";

const schema = Joi.object({
    username: Joi.string(),
    displayName: Joi.string(),
    email: Joi.string(),
    csrf: Joi.string().allow("").optional(),
});

type Data = {
    username: string;
    displayName: string;
    email: string;
};

@Injectable()
export class RegisterCallbackService implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userService: LoginUserService,
        private readonly backendUserService: BackendUserService,
        private readonly activeLoginService: ActiveLoginService,
    ) {}

    async use(req: Request, res: Response) {
        // Validate input data
        const data: Data = await schema.validateAsync(req.body);

        const activeLogin = await this.activeLoginService.findOneByOrFail({
            id: req.context.flow.getActiveLoginId(),
        });
        const loginData = await activeLogin.loginInstanceFor;
        if (!loginData) throw new Error("Login data not found for active login");

        // Check if username is still available
        if ((await this.userService.countBy({ username: data.username })) > 0) {
            throw new HttpException("Username is not available anymore", HttpStatus.BAD_REQUEST);
        }

        // If link flow, use existing user. Otherwise, create new user.
        const user = req.context.flow.isLinkFlow()
            ? await this.userService.findOneByOrFail({ id: req.context.auth.getUserId() })
            : await this.backendUserService.createNewUser(data, false);

        await this.backendUserService.linkAccountToUser(user, loginData, activeLogin);
    }
}

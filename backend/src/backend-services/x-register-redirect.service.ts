import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { LoginUserService } from "src/model/services/login-user.service";
import { LoginState, UserLoginData } from "../model/postgres/UserLoginData.entity";
import { combineURL } from "../util/utils";
import { Strategy } from "src/strategies/Strategy";
import { StrategiesService } from "../model/services/strategies.service";
import { ActiveLoginService } from "../model/services/active-login.service";
import { FlowState } from "../util/Context";

/**
 * Return data of the user data suggestion endpoint
 */
interface UserDataSuggestion {
    /**
     * A potential username to use for the registration.
     * If one is given, it was free the moment the suggestion is retrieved
     *
     * @example "testUser"
     */
    username?: string;

    /**
     * A potential name to display in the UI for the new user.
     *
     * @example "Test User"
     */
    displayName?: string;

    /**
     * A potential email of the new user.
     *
     * @example "test-user@example.com"
     */
    email?: string;
}

@Injectable()
export class RegisterRedirectService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userService: LoginUserService,
        private readonly strategiesService: StrategiesService,
        private readonly activeLoginService: ActiveLoginService,
    ) {}

    async use(req: Request, res: Response) {
        const userLoginData = await (
            await this.activeLoginService.findOneByOrFail({
                id: req.context.flow.getActiveLoginId(),
            })
        ).loginInstanceFor;

        if (userLoginData.state !== LoginState.WAITING_FOR_REGISTER)
            throw new Error("UserLoginData is not in state waiting for register");

        const strategy = this.strategiesService.getStrategyByName(req.context.flow.getStrategyTypeName());

        const url = combineURL(`auth/flow/register`, process.env.GROPIUS_ENDPOINT);

        const suggestions = await this.getDataSuggestions(userLoginData, strategy);
        if (suggestions.email) url.searchParams.append("email", suggestions.email);
        if (suggestions.username) url.searchParams.append("username", suggestions.username);
        if (suggestions.displayName) url.searchParams.append("displayName", suggestions.displayName);
        if (strategy.forceSuggestedUsername)
            url.searchParams.append("forceSuggestedUsername", String(strategy.forceSuggestedUsername));

        req.context.flow.setState(FlowState.REGISTER);
        return res.redirect(url.toString());
    }

    /**
     * Return username, display name and email suggestions for registering a user
     */
    private async getDataSuggestions(loginData: UserLoginData, strategy: Strategy): Promise<UserDataSuggestion> {
        const initial = strategy.getUserDataSuggestion(loginData);
        const suggestions: UserDataSuggestion = {};

        suggestions.email = initial.email;

        if (initial.username) {
            const exists = await this.userService.exists({ where: { username: initial.username } });
            if (!exists) {
                suggestions.username = initial.username;
            }
        }

        suggestions.displayName = initial.displayName ?? suggestions.username;

        return suggestions;
    }
}

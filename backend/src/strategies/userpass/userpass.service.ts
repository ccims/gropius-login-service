import { Inject, Injectable } from "@nestjs/common";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { StrategiesService } from "../../model/services/strategies.service";
import { StrategyUpdateAction, StrategyVariable } from "../Strategy";
import * as passportLocal from "passport-local";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import * as passport from "passport";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { AuthResult } from "../AuthResult";
import { StrategyUsingPassport } from "../StrategyUsingPassport";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";

@Injectable()
export class UserpassStrategyService extends StrategyUsingPassport {
    constructor(
        strategiesService: StrategiesService,
        strategyInstanceService: StrategyInstanceService,
        private readonly loginDataService: UserLoginDataService,
        @Inject("StateJwtService")
        stateJwtService: JwtService,
    ) {
        super("userpass", strategyInstanceService, strategiesService, stateJwtService, true, false, false, false, true);
    }

    override get acceptsVariables(): StrategyVariable[] {
        return [
            {
                name: "username",
                displayName: "Username",
                type: "string",
            },
            {
                name: "password",
                displayName: "Password",
                type: "password",
            },
        ];
    }

    override get updateActions(): StrategyUpdateAction[] {
        return [{
            name: "updatePassword",
            displayName: "Update password",
            variables: [
                {
                    name: "password",
                    displayName: "Password",
                    type: "password",
                },
            ],
        }]
    }

    protected override checkAndExtendInstanceConfig(instanceConfig: object): object {
        return {};
    }

    private async generateLoginDataData(
        username: string,
        password: string,
    ): Promise<{ username: string; password: string }> {
        return {
            username,
            password: await bcrypt.hash(password, parseInt(process.env.GROPIUS_BCRYPT_HASH_ROUNDS, 10)),
        };
    }

    /**
     * Finds the login data instance corresponding the username and password given by passport-local.
     * To be executed as passport user callback
     *
     * @param strategyInstance The instance of the userpass strategy for which to find the user
     * @param username The username retrieved by passport-local
     * @param password The (plain text) password retrieved by passport-local
     * @param done The passport done funciton to be called with the loaded login data etc. or errors
     */
    protected async passportUserCallback(
        strategyInstance: StrategyInstance,
        username: string,
        password: string,
        done: (err: any, user: AuthResult | false, info: any) => any,
    ) {
        if (!password || password.trim().length == 0) {
            done("Password cannot be empty or blank!", false, undefined);
        }

        const dataActiveLogin = {};
        const loginDataForCorrectUser = await this.loginDataService.findForStrategyAndUsernameWithDataContaining(
            strategyInstance,
            {},
            username || "",
        );

        if (loginDataForCorrectUser.length == 0) {
            const dataUserLoginData = await this.generateLoginDataData(username, password);
            return done(
                null,
                {
                    dataActiveLogin,
                    dataUserLoginData,
                    mayRegister: true,
                    noRegisterMessage: "Username or password incorrect",
                },
                {},
            );
        } else if (loginDataForCorrectUser.length > 1) {
            return done("More than one user with same username", false, undefined);
        }

        const loginData = loginDataForCorrectUser[0];
        const hasCorrectPassword = await bcrypt.compare(password, loginData.data["password"]);

        if (!hasCorrectPassword) {
            return done(null, false, { message: "Username or password incorrect" });
        }

        return done(null, { loginData, dataActiveLogin, dataUserLoginData: {}, mayRegister: false }, {});
    }

    public override createPassportStrategyInstance(strategyInstance: StrategyInstance): passport.Strategy {
        return new passportLocal.Strategy({}, this.passportUserCallback.bind(this, strategyInstance));
    }

    override getUserDataSuggestion(loginData: UserLoginData): {
        username?: string;
        displayName?: string;
        email?: string;
    } {
        return {
            username: loginData.data?.username || undefined,
            displayName: loginData.data?.displayName || undefined,
            email: loginData.data?.email || undefined,
        };
    }

    override async getLoginDataDescription(loginData: UserLoginData): Promise<string> {
        return loginData.data?.username;
    }

    override async handleAction(loginData: UserLoginData, name: string, data: Record<string, any>): Promise<void> {
        if (name === "updatePassword") {
            if (!data.password || data.password.trim().length == 0) {
                throw new Error("Password cannot be empty or blank!");
            }

            loginData.data = await this.generateLoginDataData(loginData.data["username"], data.password);
            await this.loginDataService.save(loginData);
        } else {
            throw new Error("Unknown action");
        }
    }
}

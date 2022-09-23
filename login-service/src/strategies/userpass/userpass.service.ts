import { Inject, Injectable } from "@nestjs/common";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { StrategiesService } from "../../model/services/strategies.service";
import { Strategy, StrategyVariable } from "../Strategy";
import * as passportLocal from "passport-local";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import * as passport from "passport";
import { LoginUserService } from "src/model/services/login-user.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { AuthResult } from "../AuthResult";
import { StrategyUsingPassport } from "../StrategyUsingPassport";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserpassStrategyService extends StrategyUsingPassport {
    constructor(
        strategiesService: StrategiesService,
        strategyInstanceService: StrategyInstanceService,
        private readonly loginDataService: UserLoginDataService,
        private readonly loginUserService: LoginUserService,
        @Inject("PassportStateJwt")
        passportJwtService: JwtService,
    ) {
        super("userpass", strategyInstanceService, strategiesService, passportJwtService, true, false, false, false);
    }

    override get acceptsVariables(): {
        [variableName: string]: StrategyVariable;
    } {
        return {
            username: {
                name: "string",
                displayName: "Username",
                type: "string",
            },
            password: {
                name: "string",
                displayName: "Password",
                type: "string",
            },
        };
    }

    protected override checkAndExtendInstanceConfig(instanceConfig: object): object {
        return {};
    }

    private async generateLoginDataData(password: string): Promise<{ password: string }> {
        return {
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
        const dataActiveLogin = {};
        const loginDataCandidates = await this.loginDataService.findForStrategyWithDataContaining(strategyInstance, {});
        const loginDataForCorrectUser = await this.loginDataService.findForUsernameOutOfSet(
            username,
            loginDataCandidates.map((candidate) => candidate.id),
        );

        if (loginDataForCorrectUser.length == 0) {
            const dataUserLoginData = await this.generateLoginDataData(password);
            return done(
                null,
                { dataActiveLogin, dataUserLoginData, mayRegister: true },
                { message: "Username or password incorrect" },
            );
        } else if (loginDataForCorrectUser.length > 1) {
            return done("More than one user with same username", false, undefined);
        }

        const loginData = loginDataForCorrectUser[0];
        const hasCorrectPassword = bcrypt.compare(password, loginData.data["password"]);

        if (!hasCorrectPassword) {
            return done(
                null,
                { dataActiveLogin, dataUserLoginData: {}, mayRegister: false },
                { message: "Username or password incorrect" },
            );
        }

        return done(null, { loginData, dataActiveLogin, dataUserLoginData: {}, mayRegister: false }, {});
    }

    public override createPassportStrategyInstance(strategyInstance: StrategyInstance): passport.Strategy {
        return new passportLocal.Strategy({}, this.passportUserCallback.bind(this, strategyInstance));
    }
}

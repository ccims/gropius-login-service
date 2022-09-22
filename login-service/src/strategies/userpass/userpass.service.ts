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

    public override createPassportStrategyInstance(strategyInstance: StrategyInstance): passport.Strategy {
        const loginDataService = this.loginDataService;
        const loginUserService = this.loginUserService;
        return new passportLocal.Strategy(
            {},
            async (username, password, done: (err: any, user: AuthResult | false, info: any) => any) => {
                const dataActiveLogin = {};
                const loginDataCandidates = await loginDataService.findForStrategyWithDataContaining(
                    strategyInstance,
                    {},
                );
                const loginDataForCorrectUser = await loginDataService
                    .createQueryBuilder("loginData")
                    .leftJoinAndSelect(`loginData.user`, "user")
                    .where(`user.username = :username`, { username })
                    .andWhereInIds(loginDataCandidates.map((candidate) => candidate.id))
                    .getMany();

                if (loginDataForCorrectUser.length == 0) {
                    return done(
                        null,
                        {
                            dataActiveLogin,
                            dataUserLoginData: await this.generateLoginDataData(password),
                            mayRegister: true,
                        },
                        { message: "Username or password incorrect" },
                    );
                } else if (loginDataForCorrectUser.length > 1) {
                    return done("More than one user with same username", false, undefined);
                }

                const hasCorrectPassword = bcrypt.compare(password, loginDataForCorrectUser[0].data["password"]);

                if (!hasCorrectPassword) {
                    return done(
                        null,
                        {
                            dataActiveLogin,
                            dataUserLoginData: {},
                            mayRegister: false,
                        },
                        { message: "Username or password incorrect" },
                    );
                }

                console.log(`Auth for ${username} with ${password}`);
                return done(
                    null,
                    {
                        loginData: loginDataForCorrectUser[0],
                        dataActiveLogin,
                        dataUserLoginData: {},
                        mayRegister: false,
                    },
                    {},
                );
            },
        );
    }
}

import { Inject, Injectable, Logger, Type } from "@nestjs/common";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { StrategiesService } from "../../model/services/strategies.service";
import * as passportGithub from "passport-github2";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import * as passport from "passport";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { AuthFunction, AuthResult, AuthStateData } from "../AuthResult";
import { StrategyUsingPassport } from "../StrategyUsingPassport";
import { JwtService } from "@nestjs/jwt";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { checkType } from "../utils";

@Injectable()
export class GithubStrategyService extends StrategyUsingPassport {
    private readonly loggerGithub = new Logger(GithubStrategyService.name);
    constructor(
        strategiesService: StrategiesService,
        strategyInstanceService: StrategyInstanceService,
        private readonly loginDataService: UserLoginDataService,
        @Inject("PassportStateJwt")
        passportJwtService: JwtService,
        private readonly activeLoginService: ActiveLoginService,
    ) {
        super("github", strategyInstanceService, strategiesService, passportJwtService, true, true, true, true);
    }

    /**
     * Chechs the given config is valid for a github (or github enterprise)
     *
     * Needed parameters
     * - imsTemplatedFieldsFilter containing:
     *     - graphql-url: The URL of the github graphql endpoint.
     *         If imsTemplatedFieldsFilter not given, defaults to "https://api.github.com/graphql"
     * - authorizationUrl: Oauth authorization URL. Optional, default: "https://github.com/login/oauth/authorize"
     * - tokenUrl: Oauth token url. Optional, default: "https://github.com/login/oauth/access_token"
     * - clientId: Id of GitHub oauth app. Optional, default: GROPIUS_OAUTH_CLIENT_ID config variable
     * - clientSecret: secret of GitHub oaut app. Optional, default: GROPIUS_OAUTH_CLIENT_SECRET config value
     * - callbackUrl: Oauth callback url. Should be [URL]/authenticate/:id/callback. Optional, default empty
     *
     * @param instanceConfig The instance config for a github strategy instance to check
     * @returns The extended config (with default parameters for the global github) if check successful
     */
    protected override checkAndExtendInstanceConfig(instanceConfig: object): object {
        const resultingConfig = instanceConfig;

        if (instanceConfig["imsTemplatedFieldsFilter"]) {
            const githubUrl = instanceConfig["imsTemplatedFieldsFilter"]["graphql-url"];
            if (!githubUrl) {
                throw new Error("At least GitHub URL must be given in imsTemplatedFieldsFilter");
            }
        } else {
            instanceConfig["imsTemplatedFieldsFilter"] = {
                "graphql-url": "https://api.github.com/graphql",
            };
        }

        try {
            resultingConfig["authorizationUrl"] = checkType(
                instanceConfig,
                "authorizationUrl",
                "string",
                true,
                "https://github.com/login/oauth/authorize",
            );
            resultingConfig["tokenUrl"] = checkType(
                instanceConfig,
                "tokenUrl",
                "string",
                true,
                "https://github.com/login/oauth/access_token",
            );
            resultingConfig["clientId"] = checkType(
                instanceConfig,
                "clientId",
                "string",
                true,
                process.env.GROPIUS_OAUTH_CLIENT_ID,
            );
            resultingConfig["clientSecret"] = checkType(
                instanceConfig,
                "clientSecret",
                "string",
                true,
                process.env.GROPIUS_OAUTH_CLIENT_SECRET,
            );
            resultingConfig["callbackUrl"] = checkType(instanceConfig, "callbackUrl", "string", true);
        } catch (err) {
            throw new Error("Instance config for github instance invalid: " + err.message);
        }

        new URL(instanceConfig["authorizationUrl"]);
        new URL(instanceConfig["tokenUrl"]);

        return super.checkAndExtendInstanceConfig(instanceConfig);
    }

    override async getSyncTokenForLoginData(loginData: UserLoginData): Promise<string | null> {
        const syncLogins = (
            await this.activeLoginService.findValidForLoginDataSortedByExpiration(loginData, true)
        ).filter((login) => !!login.data["accessToken"]);
        return syncLogins[0]?.data["accessToken"] ?? null;
    }

    override getImsUserTemplatedValuesForLoginData(loginData: UserLoginData): object {
        return {
            github_id: loginData.data["github_id"],
        };
    }

    override getLoginDataDataForImsUserTemplatedFields(imsUser: object): object | Promise<object> {
        return {
            github_id: imsUser["github_id"],
        };
    }

    protected override getAdditionalPassportOptions(
        strategyInstance: StrategyInstance,
        authStateData: object | AuthStateData,
    ): passport.AuthenticateOptions {
        const mode = (authStateData as AuthStateData).function;
        if (mode == AuthFunction.REGISTER_WITH_SYNC) {
            return {
                scope: ["scope", "user:email", "repo"],
            };
        } else {
            return {
                scope: ["scope", "user:email"],
            };
        }
    }

    /**
     * Finds the login data for the given strategy instance and the valued returned by GitHub.
     * To be executed as passport user callback.
     *
     * @param strategyInstance The instance of the GitHub strategy for which to find the user
     * @param accessToken The access token returned by GitHub
     * @param refreshToken The refreshToken returned by GitHub
     * @param profile The profile data for the logged in user returned by GitHub
     * @param done The done function to be called with the found login data or the error
     */
    protected async passportUserCallback(
        strategyInstance: StrategyInstance,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err, user: AuthResult | false, info) => void,
    ) {
        const username = profile.username;
        const dataActiveLogin = { accessToken, refreshToken };
        const dataUserLoginData = {
            username,
            github_id: profile.id,
            email: profile.emails[0].value,
        };
        const loginDataCandidates = await this.loginDataService.findForStrategyWithDataContaining(strategyInstance, {
            github_id: profile.id,
        });
        if (loginDataCandidates.length != 1) {
            this.loggerGithub.debug("Oauth login didn's find unique login data", loginDataCandidates);
            done(null, { dataActiveLogin, dataUserLoginData, mayRegister: true }, { message: "No unique user found" });
        } else {
            const loginData = loginDataCandidates[0];
            done(null, { loginData, dataActiveLogin, dataUserLoginData, mayRegister: true }, {});
        }
    }

    public override createPassportStrategyInstance(strategyInstance: StrategyInstance): passport.Strategy {
        return new passportGithub.Strategy(
            {
                authorizationURL: strategyInstance.instanceConfig["authorizationUrl"],
                clientID: strategyInstance.instanceConfig["clientId"],
                clientSecret: strategyInstance.instanceConfig["clientSecret"],
                tokenURL: strategyInstance.instanceConfig["tokenUrl"],
                callbackURL: strategyInstance.instanceConfig["callbackUrl"],
                store: {
                    store: (req, state, meta, callback) => callback(null, state),
                    verify: (req, providedState, callback) => callback(null, true, providedState),
                } as any,
            },
            this.passportUserCallback.bind(this, strategyInstance),
        );
    }
}

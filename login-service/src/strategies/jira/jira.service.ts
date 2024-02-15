import { Inject, Injectable, Logger, Type } from "@nestjs/common";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { StrategiesService } from "../../model/services/strategies.service";
import * as passportJira from "passport-atlassian-oauth2";
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
export class JiraStrategyService extends StrategyUsingPassport {
    private readonly loggerJira = new Logger(JiraStrategyService.name);
    constructor(
        strategiesService: StrategiesService,
        strategyInstanceService: StrategyInstanceService,
        private readonly loginDataService: UserLoginDataService,
        @Inject("PassportStateJwt")
        passportJwtService: JwtService,
        private readonly activeLoginService: ActiveLoginService,
    ) {
        super("jira", strategyInstanceService, strategiesService, passportJwtService, true, true, true, true);
    }

    /**
     * Chechs the given config is valid for a jira (or jira enterprise)
     *
     * Needed parameters
     * - imsTemplatedFieldsFilter containing:
     *     - graphql-url: The URL of the jira graphql endpoint.
     *         If imsTemplatedFieldsFilter not given, defaults to "https://api.jira.com/graphql"
     * - authorizationUrl: Oauth authorization URL. Optional, default: "https://jira.com/login/oauth/authorize"
     * - tokenUrl: Oauth token url. Optional, default: "https://jira.com/login/oauth/access_token"
     * - userProfileUrl: API URL to request user profile info from. Needs to be specified for GitHib Enterprise instances. Optional
     * - clientId: Id of Jira oauth app. Optional, default: GROPIUS_OAUTH_CLIENT_ID config variable
     * - clientSecret: secret of Jira oaut app. Optional, default: GROPIUS_OAUTH_CLIENT_SECRET config value
     * - callbackUrl: Oauth callback url. Should be [URL]/authenticate/:id/callback. Optional, default empty
     *
     * @param instanceConfig The instance config for a jira strategy instance to check
     * @returns The extended config (with default parameters for the global jira) if check successful
     */
    protected override checkAndExtendInstanceConfig(instanceConfig: object): object {
        const resultingConfig = instanceConfig;

        if (resultingConfig["imsTemplatedFieldsFilter"]) {
            const jiraUrl = resultingConfig["imsTemplatedFieldsFilter"]["graphql-url"];
            if (!jiraUrl) {
                throw new Error("At least Jira URL must be given in imsTemplatedFieldsFilter");
            }
        } else {
            resultingConfig["imsTemplatedFieldsFilter"] = {
                "graphql-url": "https://api.jira.com/graphql",
            };
        }
        resultingConfig["imsTemplatedFieldsFilter"] = {
            "root-url": "https://itscalledccims.atlassian.net/rest/api/2",
        };

        try {
            resultingConfig["authorizationUrl"] = checkType(
                instanceConfig,
                "authorizationUrl",
                "string",
                true,
                "https://auth.atlassian.com/authorize",
            );
            resultingConfig["tokenUrl"] = checkType(
                instanceConfig,
                "tokenUrl",
                "string",
                true,
                "https://auth.atlassian.com/oauth/token",
            );
            resultingConfig["userProfileUrl"] = checkType(instanceConfig, "userProfileUrl", "string", true);
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
            throw new Error("Instance config for jira instance invalid: " + err.message);
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
            jira_id: loginData.data["jira_id"],
        };
    }

    override getLoginDataDataForImsUserTemplatedFields(imsUser: object): object | Promise<object> {
        return {
            jira_id: imsUser["jira_id"],
        };
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

    /**
     * Finds the login data for the given strategy instance and the valued returned by Jira.
     * To be executed as passport user callback.
     *
     * @param strategyInstance The instance of the Jira strategy for which to find the user
     * @param accessToken The access token returned by Jira
     * @param refreshToken The refreshToken returned by Jira
     * @param profile The profile data for the logged in user returned by Jira
     * @param done The done function to be called with the found login data or the error
     */
    protected async passportUserCallback(
        strategyInstance: StrategyInstance,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err, user: AuthResult | false, info) => void,
    ) {
        console.log("Jira profile should be here, but isn't", profile);
        const username = profile.username;
        const dataActiveLogin = { accessToken, refreshToken };
        const dataUserLoginData = {
            username,
            jira_id: profile.id,
            email: profile.email,
            displayName: profile.displayName,
        };
        const loginDataCandidates = await this.loginDataService.findForStrategyWithDataContaining(strategyInstance, {
            jira_id: profile.id,
        });
        if (loginDataCandidates.length != 1) {
            this.loggerJira.debug("Oauth login didn't find unique login data", loginDataCandidates);
            done(null, { dataActiveLogin, dataUserLoginData, mayRegister: true }, { message: "No unique user found" });
        } else {
            const loginData = loginDataCandidates[0];
            done(null, { loginData, dataActiveLogin, dataUserLoginData, mayRegister: true }, {});
        }
    }

    public override createPassportStrategyInstance(strategyInstance: StrategyInstance): passport.Strategy {
        return new passportJira.Strategy(
            {
                authorizationURL: strategyInstance.instanceConfig["authorizationUrl"],
                tokenURL: strategyInstance.instanceConfig["tokenUrl"],
                userProfileURL: strategyInstance.instanceConfig["userProfileUrl"],
                clientID: strategyInstance.instanceConfig["clientId"],
                clientSecret: strategyInstance.instanceConfig["clientSecret"],
                callbackURL:
                    strategyInstance.instanceConfig["callbackUrl"] ??
                    "http://localhost:3000/authenticate/oauth/" + strategyInstance.id + "/callback",
                scope: ["read:jira-work", "write:jira-work"],
                store: {
                    store: (req, state, meta, callback) => callback(null, state),
                    verify: (req, providedState, callback) => callback(null, true, providedState),
                } as any,
            },
            this.passportUserCallback.bind(this, strategyInstance),
        );
    }
}

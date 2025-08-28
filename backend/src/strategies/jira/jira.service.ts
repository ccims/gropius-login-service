import { Inject, Injectable, Logger } from "@nestjs/common";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { StrategiesService } from "../../model/services/strategies.service";
import * as passportJira from "passport-atlassian-oauth2";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import * as passport from "passport";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { AuthResult } from "../AuthResult";
import { StrategyUsingPassport } from "../StrategyUsingPassport";
import { JwtService } from "@nestjs/jwt";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { checkType } from "../../util/checkType";
import { Schema } from "jtd";

@Injectable()
export class JiraStrategyService extends StrategyUsingPassport {
    private readonly loggerJira = new Logger(JiraStrategyService.name);
    constructor(
        strategiesService: StrategiesService,
        strategyInstanceService: StrategyInstanceService,
        private readonly loginDataService: UserLoginDataService,
        @Inject("StateJwtService")
        stateJwtService: JwtService,
        private readonly activeLoginService: ActiveLoginService,
    ) {
        super("jira", strategyInstanceService, strategiesService, stateJwtService, true, true, true, true, false);
    }

    override get instanceConfigSchema(): Record<string, Schema> {
        return {
            imsTemplatedFieldsFilter: {
                properties: {
                    "root-url": { type: "string" },
                },
            },
            authorizationUrl: { type: "string", nullable: true },
            tokenUrl: { type: "string", nullable: true },
            cloudIdUrl: { type: "string", nullable: true },
            userProfileUrl: { type: "string", nullable: true },
            clientId: { type: "string", nullable: true },
            clientSecret: { type: "string", nullable: true },
        };
    }

    /**
     * Chechs the given config is valid for a jira (or jira enterprise)
     *
     * Needed parameters
     * - imsTemplatedFieldsFilter containing:
     *     - root-url: The URL of the jira root endpoint, must be provided.
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
            const rootUrl = resultingConfig["imsTemplatedFieldsFilter"]["root-url"];
            if (!rootUrl) {
                throw new Error("At least Jira URL must be given in imsTemplatedFieldsFilter");
            }
        } else {
            throw new Error("At least imsTemplatedFieldsFilter must be given");
        }

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
            resultingConfig["cloudIdUrl"] = checkType(
                instanceConfig,
                "cloudIdUrl",
                "string",
                true,
                "https://api.atlassian.com/oauth/token/accessible-resources",
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
        } catch (err: any) {
            throw new Error("Instance config for jira instance invalid: " + err.message);
        }

        new URL(instanceConfig["authorizationUrl"]);
        new URL(instanceConfig["tokenUrl"]);

        return super.checkAndExtendInstanceConfig(instanceConfig);
    }

    override async getSyncDataForLoginData(
        loginData: UserLoginData,
    ): Promise<{ token: string | null; [key: string]: any }> {
        const syncLogins = (
            await this.activeLoginService.findValidForLoginDataSortedByExpiration(loginData, true)
        ).filter((login) => !!login.data["accessToken"]);
        const strategyInstance = await loginData.strategyInstance;
        const config = this.checkAndExtendInstanceConfig(strategyInstance.instanceConfig);
        while (syncLogins.length) {
            let firstLogin = syncLogins[0];
            this.loggerJira.log("Requesting cloud IDs");
            let cloudIds = await (
                await fetch(config["cloudIdUrl"], {
                    headers: { authorization: "Bearer " + firstLogin?.data["accessToken"] },
                })
            ).json();
            if (!cloudIds || cloudIds.code) {
                if (firstLogin.data["refreshToken"]) {
                    this.loggerJira.log("Non valid cloud IDs, refreshing token");
                    const refreshTokenResponse = await (
                        await fetch(config["tokenUrl"], {
                            headers: { "content-type": "application/json" },
                            method: "POST",
                            body: JSON.stringify({
                                grant_type: "refresh_token",
                                client_id: config["clientId"],
                                client_secret: config["clientSecret"],
                                refresh_token: firstLogin.data["refreshToken"],
                            }),
                        })
                    ).json();
                    refreshTokenResponse["accessToken"] = refreshTokenResponse["access_token"];
                    refreshTokenResponse["refreshToken"] = refreshTokenResponse["refresh_token"];
                    delete refreshTokenResponse["access_token"];
                    delete refreshTokenResponse["refresh_token"];
                    firstLogin.data = refreshTokenResponse;
                    this.loggerJira.log("Requesting cloud IDs for refreshed token");
                    cloudIds = await (
                        await fetch(config["cloudIdUrl"], {
                            headers: { authorization: "Bearer " + firstLogin?.data["accessToken"] },
                        })
                    ).json();
                    if (!cloudIds || cloudIds.code) {
                        this.loggerJira.log("Non valid cloud IDs, invalidating token");
                        firstLogin.isValid = false;
                        await this.activeLoginService.save(firstLogin);
                        syncLogins.shift();
                    } else {
                        this.loggerJira.log("Refreshed token valid");
                        firstLogin = await this.activeLoginService.save(firstLogin);
                        return { token: firstLogin?.data["accessToken"] ?? null, cloudIds: cloudIds, type: "OAUTH" };
                    }
                } else {
                    this.loggerJira.log("Non valid cloud IDs, and no refresh token token");
                    firstLogin.isValid = false;
                    await this.activeLoginService.save(firstLogin);
                    syncLogins.shift();
                }
            } else {
                this.loggerJira.log("Found valid token");
                return { token: firstLogin?.data["accessToken"] ?? null, cloudIds };
            }
        }
        this.loggerJira.log("Token list exhausted, falling back");
        return { token: null };
    }

    override getImsUserTemplatedValuesForLoginData(loginData: UserLoginData): object {
        return {
            jira_id: loginData.data["jira_id"],
            username: loginData.data["username"],
            displayName: loginData.data["displayName"],
            email: loginData.data["email"],
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
            username: loginData.data?.username?.trim(),
            displayName: loginData.data?.displayName?.trim(),
            email: loginData.data?.email?.trim(),
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
        const dataActiveLogin = { accessToken, refreshToken };
        const dataUserLoginData = {
            username: "",
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
        const configData = this.checkAndExtendInstanceConfig(strategyInstance.instanceConfig);
        const config = {
            authorizationURL: configData["authorizationUrl"],
            tokenURL: configData["tokenUrl"],
            profileURL: configData["userProfileUrl"],
            clientID: configData["clientId"],
            clientSecret: configData["clientSecret"],
            callbackURL: strategyInstance.callbackUrl,
            scope: ["offline_access", "read:jira-user", "read:me", "read:jira-work", "write:jira-work"],
            store: {
                store: (req, state, meta, callback) => callback(null, state),
                verify: (req, providedState, callback) => callback(null, true, providedState),
            } as any,
        };
        for (const key in config) {
            if (config[key] === undefined) {
                delete config[key];
            }
        }
        return new passportJira(config, this.passportUserCallback.bind(this, strategyInstance));
    }

    override async getLoginDataDescription(loginData: UserLoginData): Promise<string> {
        return loginData.data?.email;
    }

    override getCensoredInstanceConfig(instance: StrategyInstance): object {
        return {
            imsTemplatedFieldsFilter: instance.instanceConfig["imsTemplatedFieldsFilter"],
            authorizationUrl: instance.instanceConfig["authorizationUrl"],
            tokenUrl: instance.instanceConfig["tokenUrl"],
            cloudIdUrl: instance.instanceConfig["cloudIdUrl"],
            userProfileUrl: instance.instanceConfig["userProfileUrl"],
            clientId: instance.instanceConfig["clientId"],
            clientSecret: "**********",
        };
    }
}

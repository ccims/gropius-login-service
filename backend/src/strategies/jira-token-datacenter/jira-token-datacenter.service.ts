import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PerformAuthResult, Strategy, StrategyUpdateAction, StrategyVariable } from "../Strategy";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { AuthStateServerData } from "../AuthResult";
import { Schema } from "jtd";
import { StrategiesService } from "src/model/services/strategies.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { combineURL } from "src/util/combineURL";

@Injectable()
export class JiraTokenDatacenterStrategyService extends Strategy {
    constructor(
        strategiesService: StrategiesService,
        strategyInstanceService: StrategyInstanceService,
        private readonly loginDataService: UserLoginDataService,
    ) {
        super("jira-token-datacenter", strategyInstanceService, strategiesService, false, true, false, false, false);
    }

    override get instanceConfigSchema(): Record<string, Schema> {
        return {
            imsTemplatedFieldsFilter: {
                properties: {
                    "root-url": { type: "string" },
                },
            },
        };
    }

    override get acceptsVariables(): StrategyVariable[] {
        return [
            {
                name: "token",
                displayName: "API token",
                type: "password",
            },
        ];
    }

    override get updateActions(): StrategyUpdateAction[] {
        return [
            {
                name: "update-token",
                displayName: "Update API token",
                variables: [
                    {
                        name: "token",
                        displayName: "API token",
                        type: "password",
                    },
                ],
            },
        ];
    }

    /**
     * Chechs the given config is valid for a jira
     *
     * Needed parameters
     * - imsTemplatedFieldsFilter containing:
     *     - root-url: The URL of the jira root endpoint, must be provided.
     *
     * @param instanceConfig The instance config for a jira-token-datacenter strategy instance to check
     * @returns The extended config if check successful
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

        return super.checkAndExtendInstanceConfig(instanceConfig);
    }

    override async getSyncDataForLoginData(
        loginData: UserLoginData,
    ): Promise<{ token: string | null; [key: string]: any }> {
        return { token: loginData.data["token"] ?? null, type: "PAT" };
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

    override async getLoginDataDescription(loginData: UserLoginData): Promise<string> {
        return loginData.data?.username || loginData.data?.email;
    }

    override getCensoredInstanceConfig(instance: StrategyInstance): object {
        return {
            imsTemplatedFieldsFilter: instance.instanceConfig["imsTemplatedFieldsFilter"],
        };
    }

    private async getUserData(
        token: string,
        strategyInstance: StrategyInstance,
    ): Promise<{
        jira_id: string;
        username: string;
        displayName: string;
        email?: string;
        token: string;
    } | null> {
        const response = await fetch(
            combineURL("rest/api/2/myself", strategyInstance.instanceConfig["imsTemplatedFieldsFilter"]["root-url"]),
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            },
        );

        if (!response.ok) {
            return null;
        }

        const userData = await response.json();

        return {
            jira_id: userData.key,
            username: userData.name,
            displayName: userData.displayName,
            email: userData.emailAddress,
            token
        };
    }

    override async performAuth(
        strategyInstance: StrategyInstance,
        state: (AuthStateServerData & OAuthAuthorizeServerState) | undefined,
        req: any,
        res: any,
    ): Promise<PerformAuthResult> {
        const token = req.query["token"];

        const userLoginData = await this.getUserData(token, strategyInstance);
        if (userLoginData == null) {
            return { result: null, returnedState: {}, info: { message: "Token invalid" } };
        }

        return {
            result: {
                dataActiveLogin: {},
                dataUserLoginData: userLoginData,
                mayRegister: true,
            },
            returnedState: {},
            info: {},
        };
    }

    override async handleAction(loginData: UserLoginData, name: string, data: Record<string, any>): Promise<void> {
        if (name === "update-token") {
            const token = data["token"];
            const userLoginData = await this.getUserData(token, await loginData.strategyInstance);
            if (userLoginData == null) {
                throw new HttpException("Token invalid", HttpStatus.BAD_REQUEST);
            }
            if (loginData.data["jira_id"] !== userLoginData.jira_id) {
                throw new HttpException("Token does not match the user", HttpStatus.BAD_REQUEST);
            }
            loginData.data["token"] = token;
            this.loginDataService.save(loginData);
        } else {
            throw new HttpException("Unknown action", HttpStatus.BAD_REQUEST);
        }
    }
}

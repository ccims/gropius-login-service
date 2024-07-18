import { Injectable } from "@nestjs/common";
import { PerformAuthResult, Strategy, StrategyVariable } from "../Strategy";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { AuthStateServerData } from "../AuthResult";
import { Schema } from "jtd";
import { StrategiesService } from "src/model/services/strategies.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";

@Injectable()
export class GithubTokenStrategyService extends Strategy {
    constructor(strategiesService: StrategiesService, strategyInstanceService: StrategyInstanceService) {
        super("github-token", strategyInstanceService, strategiesService, false, true, false, false, false);
    }

    override get instanceConfigSchema(): Record<string, Schema> {
        return {
            imsTemplatedFieldsFilter: {
                properties: {
                    "graphql-url": { type: "string" },
                },
                nullable: true,
            },
        };
    }

    override get acceptsVariables(): Record<string, StrategyVariable> {
        return {
            token: {
                name: "token",
                displayName: "Personal access token",
                type: "password",
            },
        };
    }

    /**
     * Chechs the given config is valid for a github (or github enterprise)
     *
     * Needed parameters
     * - imsTemplatedFieldsFilter containing:
     *     - graphql-url: The URL of the github graphql endpoint.
     *         If imsTemplatedFieldsFilter not given, defaults to "https://api.github.com/graphql"
     *
     * @param instanceConfig The instance config for a github strategy instance to check
     * @returns The extended config (with default parameters for the global github) if check successful
     */
    protected override checkAndExtendInstanceConfig(instanceConfig: object): object {
        const resultingConfig = instanceConfig;

        if (resultingConfig["imsTemplatedFieldsFilter"]) {
            const githubUrl = resultingConfig["imsTemplatedFieldsFilter"]["graphql-url"];
            if (!githubUrl) {
                throw new Error("At least GitHub URL must be given in imsTemplatedFieldsFilter");
            }
        } else {
            resultingConfig["imsTemplatedFieldsFilter"] = {
                "graphql-url": "https://api.github.com/graphql",
            };
        }

        return super.checkAndExtendInstanceConfig(instanceConfig);
    }

    override async getSyncDataForLoginData(
        loginData: UserLoginData,
    ): Promise<{ token: string | null; [key: string]: any }> {
        return { token: loginData.data["accessToken"] ?? null };
    }

    override getImsUserTemplatedValuesForLoginData(loginData: UserLoginData): object {
        return {
            github_id: loginData.data["github_id"],
            username: loginData.data["username"],
            displayName: loginData.data["displayName"],
            email: loginData.data["email"],
        };
    }

    override getLoginDataDataForImsUserTemplatedFields(imsUser: object): object | Promise<object> {
        return {
            github_id: imsUser["github_id"],
        };
    }

    override async getLoginDataDescription(loginData: UserLoginData): Promise<string> {
        return loginData.data?.username;
    }

    override getCensoredInstanceConfig(instance: StrategyInstance): object {
        return {
            imsTemplatedFieldsFilter: instance.instanceConfig["imsTemplatedFieldsFilter"],
            authorizationUrl: instance.instanceConfig["authorizationUrl"],
            tokenUrl: instance.instanceConfig["tokenUrl"],
            userProfileUrl: instance.instanceConfig["userProfileUrl"],
            clientId: instance.instanceConfig["clientId"],
            clientSecret: "**********",
        };
    }

    override async performAuth(
        strategyInstance: StrategyInstance,
        state: (AuthStateServerData & OAuthAuthorizeServerState) | undefined,
        req: any,
        res: any,
    ): Promise<PerformAuthResult> {
        const token = req.query["token"];
        const graphqlQuery = `
        {
            viewer {
                id
                login
                name
                email
            }
        }
        `;
        const response = await fetch(strategyInstance.instanceConfig["imsTemplatedFieldsFilter"]["graphql-url"], {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: graphqlQuery }),
        });

        if (!response.ok) {
            return { result: null, returnedState: {}, info: { message: "Token invalid" } };
        }

        const data = await response.json();
        const userData = data.data.viewer;

        const userLoginData = {
            github_id: userData.id,
            username: userData.login,
            displayName: userData.name,
            email: userData.email,
        };

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
}

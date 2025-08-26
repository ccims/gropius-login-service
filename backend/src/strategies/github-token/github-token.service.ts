import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PerformAuthResult, Strategy, StrategyUpdateAction, StrategyVariable } from "../Strategy";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { Schema } from "jtd";
import { StrategiesService } from "src/model/services/strategies.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { FlowContext } from "../../util/FlowContext";

@Injectable()
export class GithubTokenStrategyService extends Strategy {
    constructor(
        strategiesService: StrategiesService,
        strategyInstanceService: StrategyInstanceService,
        private readonly loginDataService: UserLoginDataService,
    ) {
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

    override get acceptsVariables(): StrategyVariable[] {
        return [
            {
                name: "token",
                displayName: "Personal access token",
                type: "password",
            },
        ];
    }

    override get updateActions(): StrategyUpdateAction[] {
        return [
            {
                name: "update-token",
                displayName: "Update personal access token",
                variables: [
                    {
                        name: "token",
                        displayName: "Personal access token",
                        type: "password",
                    },
                ],
            },
        ];
    }

    /**
     * Chechs the given config is valid for a github (or github enterprise)
     *
     * Needed parameters
     * - imsTemplatedFieldsFilter containing:
     *     - graphql-url: The URL of the github graphql endpoint.
     *         If imsTemplatedFieldsFilter not given, defaults to "https://api.github.com/graphql"
     *
     * @param instanceConfig The instance config for a github-token strategy instance to check
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
        return { token: loginData.data["token"] ?? null };
    }

    override getImsUserTemplatedValuesForLoginData(loginData: UserLoginData): object {
        return {
            github_id: loginData.data["github_id"],
            github_node_id: loginData.data["github_node_id"],
            username: loginData.data["username"],
            displayName: loginData.data["displayName"],
            email: loginData.data["email"],
        };
    }

    override getLoginDataDataForImsUserTemplatedFields(imsUser: object): object | Promise<object> {
        return {
            github_id: imsUser["github_id"],
            github_node_id: imsUser["github_node_id"],
        };
    }

    override async getLoginDataDescription(loginData: UserLoginData): Promise<string> {
        return loginData.data?.username;
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
        github_id: number;
        github_node_id: string;
        username: string;
        displayName: string;
        email: string;
        token: string;
    } | null> {
        const graphqlQuery = `
        {
            viewer {
                id
                databaseId
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
            return null;
        }

        const data = await response.json();
        const userData = data.data.viewer;

        return {
            github_id: userData.databaseId,
            github_node_id: userData.id,
            username: userData.login,
            displayName: userData.name,
            email: userData.email,
            token,
        };
    }

    override async performAuth(
        strategyInstance: StrategyInstance,
        context: FlowContext | undefined,
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
            if (loginData.data["github_id"] !== userLoginData.github_id) {
                throw new HttpException("Token does not match the user", HttpStatus.BAD_REQUEST);
            }
            loginData.data["token"] = token;
            this.loginDataService.save(loginData);
        } else {
            throw new HttpException("Unknown action", HttpStatus.BAD_REQUEST);
        }
    }
}

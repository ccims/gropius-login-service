import { Injectable, OnModuleInit } from "@nestjs/common";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { UserLoginData, LoginState } from "src/model/postgres/UserLoginData.entity";
import { LoginUserService } from "src/model/services/login-user.service";
import { StrategiesService } from "src/model/services/strategies.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";

/**
 * Service that creates a new strategy instance as specified in the config variables
 *
 * Listens for the lifecycle event `onModuleInit` of the module
 */
@Injectable()
export class CreateDefaultStrategyInstanceService {
    constructor(
        private readonly strategiesService: StrategiesService,
        private readonly strategyInstanceService: StrategyInstanceService,
    ) {}

    async createDefaultStrtegyInstance() {
        const strategyName = process.env.GROPIUS_DEFAULT_STRATEGY_INSTANCE_TYPE;
        let instanceConfig: string | object = process.env.GROPIUS_DEFAULT_STRATEGY_INSTANCE_CONFIG;
        const instanceName = process.env.GROPIUS_DEFAULT_STRATEGY_INSTANCE_NAME;

        if (!strategyName || !instanceConfig) {
            return;
        }
        if (instanceName) {
            const existingInstance = await this.strategyInstanceService.findOneBy({
                name: instanceName,
                isLoginActive: true,
            });
            if (existingInstance) {
                console.log(
                    `Strategy named ${instanceName} with enabled login already exists. Skipping creation; Id:`,
                    existingInstance.id,
                );
                return;
            }
        } else {
            const existingClient = await this.strategyInstanceService.findOneBy({
                type: strategyName,
                isLoginActive: true,
            });
            if (existingClient) {
                console.log(
                    `No name for default strategy instance given and instance of type ` +
                        `${strategyName} with enabled login already existed. Skiping creation; Id:`,
                    existingClient.id,
                );
                return;
            }
        }
        if (typeof instanceConfig == "string") {
            instanceConfig = JSON.parse(instanceConfig);
        }
        if (typeof instanceConfig != "object") {
            throw new Error(`Specified instance config is not an object`);
        }
        if (!this.strategiesService.hasStrategy(strategyName)) {
            throw new Error(`Specified strategy type ${strategyName} does not exist`);
        }
        const strategy = this.strategiesService.getStrategyByName(strategyName);
        const instance = await strategy.createOrUpdateNewInstance({
            type: strategyName,
            name: instanceName,
            instanceConfig,
        });
    }
}

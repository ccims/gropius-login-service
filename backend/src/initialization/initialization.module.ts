import { Module } from "@nestjs/common";
import { BackendServicesModule } from "../backend-services/backend-services.module.js";
import { ModelModule } from "../model/model.module.js";
import { CreateDefaultStrategyInstanceService } from "./create-default-strategy-instance.service.js";
import { CreateDefaultUserService } from "./create-default-user.service.js";
import { InitListenerService } from "./init-listener.service.js";
import { CheckDatabaseConsistencyService } from "./check-database-consistency.service.js";

/**
 * Module for running all code that needs to be executed on startup/initialization and is not needed in main.ts
 *
 * Currently contains:
 * - Creation of default strategy instance
 * - Creation of default user
 */
@Module({
    imports: [ModelModule, BackendServicesModule],
    providers: [
        CheckDatabaseConsistencyService,
        CreateDefaultStrategyInstanceService,
        CreateDefaultUserService,
        InitListenerService,
    ],
})
export class InitializationModule {}

import { Module } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { CreateDefaultStrategyInstanceService } from "./create-default-strategy-instance.service";
import { CreateDefaultUserService } from "./create-default-user.service";
import { InitListenerService } from "./init-listener.service";
import { CheckDatabaseConsistencyService } from "./check-database-consistency.service";

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

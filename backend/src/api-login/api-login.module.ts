import { Module } from "@nestjs/common";
import { BackendServicesModule } from "../backend-services/backend-services.module.js";
import { ModelModule } from "../model/model.module.js";
import { StrategiesModule } from "../strategies/strategies.module.js";
import { AuthClientController } from "./auth/auth-clients.controller.js";
import { StrategiesController } from "./strategy/strategies.controller.js";
import { StrategyInstancesController } from "./strategy/strategy-instances.controller.js";
import { UsersController } from "./auth/users.controller.js";
import { LoginDataController } from "./auth/login-data.controller.js";

/**
 * Module that contains all controllers for the regular login-service API
 * (Except the actual authentication).
 * All entities are accessed over this Module.
 */
@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    controllers: [
        UsersController,
        StrategiesController,
        StrategyInstancesController,
        AuthClientController,
        LoginDataController,
    ],
    providers: [],
    exports: [],
})
export class ApiLoginModule {}

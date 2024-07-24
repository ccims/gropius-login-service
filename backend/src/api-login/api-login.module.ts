import { Module } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { StrategiesModule } from "src/strategies/strategies.module";
import { AuthClientController } from "./auth/auth-clients.controller";
import { CheckRegistrationTokenService } from "./auth/check-registration-token.service";
import { RegisterController } from "./auth/register.controller";
import { StrategiesController } from "./strategy/strategies.controller";
import { StrategyInstancesController } from "./strategy/strategy-instances.controller";
import { UsersController } from "./auth/users.controller";
import { LoginDataController } from "./auth/login-data.controller";

/**
 * Module that contains all controllers for the regular login-service API
 * (Except the actual authentication).
 * All entities are accessed over this Module.
 */
@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    controllers: [
        RegisterController,
        UsersController,
        StrategiesController,
        StrategyInstancesController,
        AuthClientController,
        LoginDataController,
    ],
    providers: [CheckRegistrationTokenService],
    exports: [CheckRegistrationTokenService],
})
export class ApiLoginModule {}

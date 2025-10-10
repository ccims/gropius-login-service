import { Module } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { StrategiesModule } from "../strategies/strategies.module";
import { AuthEndpointsController } from "./auth-endpoints.controller";
import { ApiOauthModule } from "src/api-oauth/api-oauth.module";
import { ApiLoginModule } from "src/api-login/api-login.module";
import { UpdateActionController } from "./update-action.controller";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule, ApiOauthModule, ApiLoginModule],
    controllers: [AuthEndpointsController, UpdateActionController],
})
export class ApiInternalModule {}

import { Module } from "@nestjs/common";
import { BackendServicesModule } from "../backend-services/backend-services.module.js";
import { ModelModule } from "../model/model.module.js";
import { StrategiesModule } from "../strategies/strategies.module.js";
import { AuthEndpointsController } from "./auth-endpoints.controller.js";
import { ApiOauthModule } from "../api-oauth/api-oauth.module.js";
import { ApiLoginModule } from "../api-login/api-login.module.js";
import { UpdateActionController } from "./update-action.controller.js";
import { LegalinformationController } from "./legal-information.controller.js";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule, ApiOauthModule, ApiLoginModule],
    controllers: [AuthEndpointsController, UpdateActionController, LegalinformationController],
})
export class ApiInternalModule {}

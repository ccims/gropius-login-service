import { Module } from "@nestjs/common";
import { BackendServicesModule } from "../backend-services/backend-services.module.js";
import { ModelModule } from "../model/model.module.js";
import { StrategiesModule } from "../strategies/strategies.module.js";
import { SyncImsUserController } from "./sync-ims-user.controller.js";

@Module({
    imports: [ModelModule, StrategiesModule, BackendServicesModule],
    controllers: [SyncImsUserController],
})
export class ApiSyncModule {}

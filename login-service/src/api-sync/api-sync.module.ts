import { Module } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { StrategiesModule } from "src/strategies/strategies.module";
import { SyncImsUserController } from "./sync-ims-user.controller";

@Module({
    imports: [ModelModule, StrategiesModule, BackendServicesModule],
    controllers: [SyncImsUserController],
})
export class ApiSyncModule {}

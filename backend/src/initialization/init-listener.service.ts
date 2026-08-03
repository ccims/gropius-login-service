import { Injectable, type OnModuleInit } from "@nestjs/common";
import { CreateDefaultStrategyInstanceService } from "./create-default-strategy-instance.service.js";
import { CreateDefaultUserService } from "./create-default-user.service.js";
import { CheckDatabaseConsistencyService } from "./check-database-consistency.service.js";

@Injectable()
export class InitListenerService implements OnModuleInit {
    constructor(
        private readonly dbConsistencyService: CheckDatabaseConsistencyService,
        private readonly createInstanceService: CreateDefaultStrategyInstanceService,
        private readonly createUserService: CreateDefaultUserService,
    ) {}

    async onModuleInit() {
        if (process.env.GROPIUS_DEFAULT_ENTITIES_ENABLED == "false") {
            return;
        }
        await this.dbConsistencyService.runDatabaseCheck();
        await this.createInstanceService.createDefaultStrtegyInstance();
        await this.createUserService.createDefaultUser();
    }
}

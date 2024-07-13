import { Injectable, OnModuleInit } from "@nestjs/common";
import { CreateDefaultStrategyInstanceService } from "./create-default-strategy-instance.service";
import { CreateDefaultUserService } from "./create-default-user.service";
import { CheckDatabaseConsistencyService } from "./check-database-consistency.service";

@Injectable()
export class InitListenerService implements OnModuleInit {
    constructor(
        private readonly dbConsistencyService: CheckDatabaseConsistencyService,
        private readonly createInstanceService: CreateDefaultStrategyInstanceService,
        private readonly createUserService: CreateDefaultUserService,
    ) {}

    async onModuleInit() {
        await this.dbConsistencyService.runDatabaseCheck();
        await this.createInstanceService.createDefaultStrtegyInstance();
        await this.createUserService.createDefaultUser();
    }
}

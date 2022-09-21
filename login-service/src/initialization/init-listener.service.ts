import { Injectable, OnModuleInit } from "@nestjs/common";
import { CreateDefaultAuthClientService } from "./create-default-auth-client.service";
import { CreateDefaultStrategyInstanceService } from "./create-default-strategy-instance.service";
import { CreateDefaultUserService } from "./create-default-user.service";

@Injectable()
export class InitListenerService implements OnModuleInit {
    constructor(
        private readonly createInstanceService: CreateDefaultStrategyInstanceService,
        private readonly createUserService: CreateDefaultUserService,
        private readonly createClientService: CreateDefaultAuthClientService,
    ) {}

    async onModuleInit() {
        await this.createInstanceService.createDefaultStrtegyInstance();
        await this.createUserService.createDefaultUser();
        await this.createClientService.createDefaultAuthClient();
    }
}

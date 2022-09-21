import { Injectable } from "@nestjs/common";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { UserLoginData, LoginState } from "src/model/postgres/UserLoginData.entity";
import { AuthClientService } from "src/model/services/auth-client.service";
import { LoginUserService } from "src/model/services/login-user.service";
import { StrategiesService } from "src/model/services/strategies.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";

@Injectable()
export class CreateDefaultAuthClientService {
    constructor(
        private readonly strategiesService: StrategiesService,
        private readonly strategyInstanceService: StrategyInstanceService,
        private readonly loginUserService: LoginUserService,
        private readonly userLoginDataService: UserLoginDataService,
        private readonly backendUserService: BackendUserService,
        private readonly authClientService: AuthClientService,
    ) {}

    async createDefaultAuthClient() {
        const clientName = process.env.GROPIUS_DEFAULT_AUTH_CLIENT_NAME;

        if (!clientName) {
            return;
        }
        let authClient = await this.authClientService.findOneBy({
            name: clientName,
            requiresSecret: false,
            isValid: true,
        });
        if (authClient) {
            console.log(
                `Valid auth client with name ${clientName} without secret already exists. Skipping creation. Id:`,
                authClient.id,
            );
            return;
        }

        authClient = new AuthClient();
        authClient.isValid = true;
        authClient.name = clientName;
        authClient.requiresSecret = false;
        authClient.clientSecrets = [];
        authClient.redirectUrls = [];
        authClient = await this.authClientService.save(authClient);

        console.log(`Created auth client with name ${clientName} without secret. Id:`, authClient.id);
    }
}

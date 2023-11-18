import { Injectable, Logger } from "@nestjs/common";
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
    private readonly logger = new Logger(CreateDefaultAuthClientService.name);
    constructor(
        private readonly strategiesService: StrategiesService,
        private readonly strategyInstanceService: StrategyInstanceService,
        private readonly loginUserService: LoginUserService,
        private readonly userLoginDataService: UserLoginDataService,
        private readonly backendUserService: BackendUserService,
        private readonly authClientService: AuthClientService,
    ) { }

    async createDefaultAuthClient() {
        const clientName = process.env.GROPIUS_DEFAULT_AUTH_CLIENT_NAME;
        const clientId = process.env.GROPIUS_DEFAULT_AUTH_CLIENT_ID;
        const redirectUri = process.env.GROPIUS_DEFAULT_AUTH_CLIENT_REDIRECT;

        if (!clientName && !clientId) {
            return;
        }
        const nameObject = clientName ? { name: clientName } : {}
        const idObject = clientId ? { id: clientId } : {}
        let authClient = await this.authClientService.findOneBy({
            ...nameObject,
            ...idObject,
            requiresSecret: false,
            isValid: true,
        });
        if (authClient) {
            this.logger.log(
                `Valid auth client with name ${clientName} without secret already exists. Skipping creation. Id:`,
                authClient.id,
            );
            if (!authClient.redirectUrls.includes(redirectUri)) {
                this.logger.warn(`The existing auth client does not include the redirect url specified as config parameter! 
If you require this, remove the existing client OR change the redirect URL via the API`)
            }
            return;
        }


        authClient = new AuthClient();
        if (clientId) {
            authClient.id = clientId;
        }
        authClient.isValid = true;
        authClient.name = clientName;
        authClient.requiresSecret = false;
        authClient.clientSecrets = [];
        if (redirectUri) {
            authClient.redirectUrls = [redirectUri];
        } else {
            authClient.redirectUrls = [];
        }
        authClient = await this.authClientService.save(authClient);

        this.logger.log(`Created auth client with name ${clientName} without secret. Id:`, authClient.id);
    }
}

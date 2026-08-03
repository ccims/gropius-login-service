import { Module } from "@nestjs/common";
import { ModelModule } from "../model/model.module.js";
import { AuthorizeController as OAuthAuthorizeController } from "./authorize.controller.js";
import { TokenController } from "./token.controller.js";
import { BackendServicesModule } from "../backend-services/backend-services.module.js";
import { StrategiesModule } from "../strategies/strategies.module.js";
import { TokenExchangeClientCredentialsService } from "../backend-services/x-token-exchange-client-credentials.service.js";
import { TokenExchangeAuthorizationCodeService } from "../backend-services/x-token-exchange-authorization-code.service.js";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    providers: [TokenExchangeAuthorizationCodeService, TokenExchangeClientCredentialsService],
    controllers: [OAuthAuthorizeController, TokenController],
    exports: [],
})
export class ApiOauthModule {}

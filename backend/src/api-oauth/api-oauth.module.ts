import { Module } from "@nestjs/common";
import { ModelModule } from "src/model/model.module";
import { AuthorizeController as OAuthAuthorizeController } from "./authorize.controller";
import { TokenController } from "./token.controller";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { StrategiesModule } from "src/strategies/strategies.module";
import { TokenExchangeClientCredentialsService } from "../backend-services/x-token-exchange-client-credentials.service";
import { TokenExchangeAuthorizationCodeService } from "../backend-services/x-token-exchange-authorization-code.service";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    providers: [TokenExchangeAuthorizationCodeService, TokenExchangeClientCredentialsService],
    controllers: [OAuthAuthorizeController, TokenController],
    exports: [],
})
export class ApiOauthModule {}

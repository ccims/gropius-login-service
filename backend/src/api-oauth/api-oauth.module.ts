import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ModelModule } from "src/model/model.module";
import { RequestExtractMiddleware } from "./request-extract.middleware";
import { TokenMiddleware as OAuthTokenMiddleware } from "./token.middleware";
import { AuthorizeController as OAuthAuthorizeController } from "./authorize.controller";
import { TokenController } from "./token.controller";
import { LoginRedirectMiddleware } from "./login-redirect.middleware";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { StrategiesModule } from "src/strategies/strategies.module";
import { FlowSkipMiddleware } from "./flow-skip.middleware";
import { CodeRedirectMiddleware } from "../api-internal/code-redirect.middleware";
import { PromptRedirectMiddleware } from "../api-internal/prompt-redirect.middleware";
import { FlowInitMiddleware } from "./flow-init.middleware";
import { TokenExchangeClientCredentialsService } from "./token-exchange-client-credentials.service";
import { TokenExchangeAuthorizationCodeService } from "./token-exchange-authorization-code.service";
import { RegisterRedirectMiddleware } from "../api-internal/register-redirect.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    providers: [TokenExchangeAuthorizationCodeService, TokenExchangeClientCredentialsService],
    controllers: [OAuthAuthorizeController, TokenController],
    exports: [],
})
export class ApiOauthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                FlowInitMiddleware,
                RequestExtractMiddleware,
                FlowSkipMiddleware,
                PromptRedirectMiddleware,
                RegisterRedirectMiddleware,
                CodeRedirectMiddleware,
                LoginRedirectMiddleware,
            )
            .forRoutes("auth/oauth/authorize");

        consumer.apply(OAuthTokenMiddleware).forRoutes("auth/oauth/token");
    }
}

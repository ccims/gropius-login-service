import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ModelModule } from "src/model/model.module";
import { RequestExtractMiddleware } from "./request-extract.middleware";
import { OauthTokenMiddleware as OAuthTokenMiddleware } from "./oauth-token.middleware";
import { OauthAuthorizeController as OAuthAuthorizeController } from "./oauth-authorize.controller";
import { OAuthTokenController } from "./oauth-token.controller";
import { LoginRedirectMiddleware } from "./login-redirect.middleware";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { StrategiesModule } from "src/strategies/strategies.module";
import { FlowSkipMiddleware } from "./flow-skip.middleware";
import { CodeRedirectMiddleware } from "../api-internal/code-redirect.middleware";
import { PromptRedirectMiddleware } from "../api-internal/prompt-redirect.middleware";
import { FlowInitMiddleware } from "./flow-init.middleware";
import { ClientCredentialsService } from "./client-credentials.service";
import { AuthorizationCodeService } from "./authorization-code.service";
import { RegisterRedirectMiddleware } from "../api-internal/register-redirect.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    providers: [AuthorizationCodeService, ClientCredentialsService],
    controllers: [OAuthAuthorizeController, OAuthTokenController],
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

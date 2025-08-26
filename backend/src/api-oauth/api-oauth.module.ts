import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ModelModule } from "src/model/model.module";
import { RequestExtractMiddleware } from "./request-extract.middleware";
import { OauthTokenMiddleware as OAuthTokenMiddleware } from "./oauth-token.middleware";
import { OauthAuthorizeController as OAuthAuthorizeController } from "./oauth-authorize.controller";
import { OAuthTokenController } from "./oauth-token.controller";
import { LoginRedirectMiddleware } from "./login-redirect-middleware.service";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { StrategiesModule } from "src/strategies/strategies.module";
import { FlowSkipMiddleware } from "./flow-skip-middleware.service";
import { CodeRedirectMiddleware } from "../api-internal/auth-code-redirect-middleware.service";
import { PromptRedirectMiddleware } from "../api-internal/prompt-redirect-middleware.service";
import { FlowInitMiddleware } from "./flow-init-middleware.service";
import { OAuthTokenClientCredentialsMiddleware } from "./oauth-token-client-credentials.middleware";
import { OAuthTokenAuthorizationCodeMiddleware } from "./oauth-token-authorization-code.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    providers: [OAuthTokenAuthorizationCodeMiddleware, OAuthTokenClientCredentialsMiddleware],
    controllers: [OAuthAuthorizeController, OAuthTokenController],
    exports: [],
})
export class ApiOauthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                RequestExtractMiddleware,
                FlowInitMiddleware,
                FlowSkipMiddleware,
                PromptRedirectMiddleware,
                CodeRedirectMiddleware,
                LoginRedirectMiddleware,
            )
            .forRoutes("auth/oauth/authorize");

        consumer.apply(OAuthTokenMiddleware).forRoutes("auth/oauth/token");
    }
}

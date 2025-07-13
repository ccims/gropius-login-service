import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ModelModule } from "src/model/model.module";
import { OAuthAuthorizeExtractMiddleware } from "./oauth-authorize-extract.middleware";
import { OauthTokenMiddleware as OAuthTokenMiddleware } from "./oauth-token.middleware";
import { OauthAuthorizeController as OAuthAuthorizeController } from "./oauth-authorize.controller";
import { OAuthTokenController } from "./oauth-token.controller";
import { OAuthAuthorizeValidateMiddleware } from "./oauth-authorize-validate.middleware";
import { OAuthAuthorizeRedirectMiddleware } from "./oauth-authorize-redirect.middleware";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { StrategiesModule } from "src/strategies/strategies.module";
import { FlowSessionSwitchMiddleware } from "./flow-session-switch.middleware";
import { AuthRedirectMiddleware } from "../api-internal/auth-redirect.middleware";
import { AuthPromptRedirectMiddleware } from "../api-internal/auth-prompt-redirect.middleware";
import { FlowSessionInitMiddleware } from "./flow-session-init.middleware";
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
                OAuthAuthorizeExtractMiddleware,
                OAuthAuthorizeValidateMiddleware,
                FlowSessionInitMiddleware,
                FlowSessionSwitchMiddleware,
                AuthPromptRedirectMiddleware,
                AuthRedirectMiddleware,
                OAuthAuthorizeRedirectMiddleware,
            )
            .forRoutes("auth/oauth/authorize");

        consumer.apply(OAuthTokenMiddleware).forRoutes("auth/oauth/token");
    }
}

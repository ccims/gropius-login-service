import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ModelModule } from "src/model/model.module";
import { OAuthAuthorizeExtractMiddleware } from "./middlewares/oauth-authorize-extract.middleware";
import { OauthTokenMiddleware as OAuthTokenMiddleware } from "./middlewares/oauth-token.middleware";
import { OauthAuthorizeController as OAuthAuthorizeController } from "./controllers/oauth-authorize.controller";
import { OAuthTokenController } from "./controllers/oauth-token.controller";
import { OAuthAuthorizeValidateMiddleware } from "./middlewares/oauth-authorize-validate.middleware";
import { OAuthAuthorizeRedirectMiddleware } from "./middlewares/oauth-authorize-redirect.middleware";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { StrategiesModule } from "src/strategies/strategies.module";
import { FlowSessionSwitchMiddleware } from "./middlewares/flow-session-switch.middleware";
import { AuthRedirectMiddleware } from "../api-internal/middlewares/auth-redirect.middleware";
import { AuthPromptRedirectMiddleware } from "../api-internal/middlewares/auth-prompt-redirect.middleware";
import { FlowSessionInitMiddleware } from "./middlewares/flow-session-init.middleware";
import { OAuthTokenClientCredentialsMiddleware } from "./middlewares/oauth-token-client-credentials.middleware";
import { OAuthTokenAuthorizationCodeMiddleware } from "./middlewares/oauth-token-authorization-code.middleware";

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

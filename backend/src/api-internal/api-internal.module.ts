import { MiddlewareConsumer, Module } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { ModeExtractorMiddleware } from "./mode-extractor.middleware";
import { StrategiesMiddleware } from "../strategies/strategies.middleware";
import { StrategiesModule } from "../strategies/strategies.module";
import { AuthEndpointsController } from "./auth-endpoints.controller";
import { AuthRedirectMiddleware } from "./auth-redirect.middleware";
import { ApiOauthModule } from "src/api-oauth/api-oauth.module";
import { OAuthAuthorizeValidateMiddleware } from "src/api-oauth/oauth-authorize-validate.middleware";
import { AuthRegisterMiddleware } from "./auth-register.middleware";
import { ApiLoginModule } from "src/api-login/api-login.module";
import { UpdateActionController } from "./update-action.controller";
import { FlowSessionSetAuthenticatedMiddleware } from "./flow-session-set-authenticated.middleware";
import { AuthPromptRedirectMiddleware } from "./auth-prompt-redirect.middleware";
import { AuthPromptCallbackMiddleware } from "./auth-prompt-callback.middleware";
import { FlowSessionRestoreMiddleware } from "../api-oauth/flow-session-restore.middleware";
import { FlowSessionInitMiddleware } from "../api-oauth/flow-session-init.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule, ApiOauthModule, ApiLoginModule],
    controllers: [AuthEndpointsController, UpdateActionController],
})
export class ApiInternalModule {
    configure(consumer: MiddlewareConsumer) {
        // TODO: CSRF?
        consumer
            .apply(
                FlowSessionInitMiddleware,
                FlowSessionRestoreMiddleware,
                OAuthAuthorizeValidateMiddleware,
                ModeExtractorMiddleware,
                StrategiesMiddleware,
            )
            .forRoutes("auth/api/internal/auth/redirect/:id/:mode");

        consumer
            .apply(
                FlowSessionInitMiddleware,
                FlowSessionRestoreMiddleware,
                StrategiesMiddleware,
                FlowSessionSetAuthenticatedMiddleware,
                AuthPromptRedirectMiddleware,
                AuthRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/callback/:id");

        consumer
            .apply(
                FlowSessionInitMiddleware,
                FlowSessionRestoreMiddleware,
                OAuthAuthorizeValidateMiddleware,
                ModeExtractorMiddleware,
                StrategiesMiddleware,
                FlowSessionSetAuthenticatedMiddleware,
                AuthPromptRedirectMiddleware,
                AuthRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/submit/:id/:mode");

        consumer
            .apply(
                FlowSessionInitMiddleware,
                FlowSessionRestoreMiddleware,
                AuthPromptCallbackMiddleware,
                AuthRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/prompt/callback");

        // TODO: CSRF?
        // TODO: not tested
        consumer
            .apply(
                FlowSessionInitMiddleware,
                FlowSessionRestoreMiddleware,
                OAuthAuthorizeValidateMiddleware,
                AuthRegisterMiddleware,
                FlowSessionSetAuthenticatedMiddleware,
                AuthPromptRedirectMiddleware,
                AuthRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/register");

        consumer
            .apply(FlowSessionInitMiddleware, FlowSessionRestoreMiddleware)
            .forRoutes("auth/api/internal/auth/external-flow");

        consumer
            .apply(FlowSessionInitMiddleware, FlowSessionRestoreMiddleware)
            .forRoutes("auth/api/internal/auth/prompt/data");

        // TODO: CSRF?
        consumer
            .apply(FlowSessionInitMiddleware, FlowSessionRestoreMiddleware)
            .forRoutes("auth/api/internal/auth/logout/current");

        // TODO: CSRF?
        consumer
            .apply(FlowSessionInitMiddleware, FlowSessionRestoreMiddleware)
            .forRoutes("auth/api/internal/auth/logout/everywhere");
    }
}

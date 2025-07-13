import { MiddlewareConsumer, Module } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { ModeExtractorMiddleware } from "./middlewares/mode-extractor.middleware";
import { StrategiesMiddleware } from "../strategies/strategies.middleware";
import { StrategiesModule } from "../strategies/strategies.module";
import { AuthEndpointsController } from "./controllers/auth-endpoints.controller";
import { AuthRedirectMiddleware } from "./middlewares/auth-redirect.middleware";
import { ApiOauthModule } from "src/api-oauth/api-oauth.module";
import { AuthAuthorizeExtractMiddleware } from "./middlewares/auth-authorize-extract.middleware";
import { OAuthAuthorizeValidateMiddleware } from "src/api-oauth/middlewares/oauth-authorize-validate.middleware";
import { AuthRegisterMiddleware } from "./middlewares/auth-register.middleware";
import { ApiLoginModule } from "src/api-login/api-login.module";
import { UpdateActionController } from "./controllers/update-action.controller";
import { FlowSessionSetAuthenticatedMiddleware } from "./middlewares/flow-session-set-authenticated.middleware";
import { AuthPromptRedirectMiddleware } from "./middlewares/auth-prompt-redirect.middleware";
import { AuthPromptCallbackMiddleware } from "./middlewares/auth-prompt-callback.middleware";
import { FlowSessionRestoreMiddleware } from "../api-oauth/middlewares/flow-session-restore.middleware";
import { FlowSessionInitMiddleware } from "../api-oauth/middlewares/flow-session-init.middleware";

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
                AuthAuthorizeExtractMiddleware,
                OAuthAuthorizeValidateMiddleware,
                ModeExtractorMiddleware,
                StrategiesMiddleware,
            )
            .forRoutes("auth/api/internal/auth/redirect/:id/:mode");

        consumer
            .apply(
                FlowSessionInitMiddleware,
                StrategiesMiddleware,
                FlowSessionSetAuthenticatedMiddleware,
                AuthPromptRedirectMiddleware,
                AuthRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/callback/:id");

        consumer
            .apply(
                FlowSessionInitMiddleware,
                AuthAuthorizeExtractMiddleware,
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
                AuthPromptCallbackMiddleware,
                FlowSessionRestoreMiddleware,
                AuthRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/prompt/callback");

        // TODO: CSRF?
        consumer
            .apply(
                FlowSessionInitMiddleware,
                AuthAuthorizeExtractMiddleware,
                OAuthAuthorizeValidateMiddleware,
                AuthRegisterMiddleware,
                FlowSessionSetAuthenticatedMiddleware,
                AuthPromptRedirectMiddleware,
                AuthRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/register");

        consumer.apply(FlowSessionInitMiddleware).forRoutes("auth/api/internal/auth/external-flow");
    }
}

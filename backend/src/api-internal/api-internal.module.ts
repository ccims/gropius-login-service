import { MiddlewareConsumer, Module } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { ModeExtractorMiddleware } from "./mode-extractor.middleware";
import { StrategiesMiddleware } from "../strategies/strategies.middleware";
import { StrategiesModule } from "../strategies/strategies.module";
import { AuthEndpointsController } from "./auth-endpoints.controller";
import { CodeRedirectMiddleware } from "./code-redirect.middleware";
import { ApiOauthModule } from "src/api-oauth/api-oauth.module";
import { RegisterCallbackMiddleware } from "./register-callback.middleware";
import { ApiLoginModule } from "src/api-login/api-login.module";
import { UpdateActionController } from "./update-action.controller";
import { FlowSetAuthenticatedMiddleware } from "./flow-set-authenticated.middleware";
import { PromptRedirectMiddleware } from "./prompt-redirect.middleware";
import { PromptCallbackMiddleware } from "./prompt-callback.middleware";
import { FlowInitMiddleware } from "../api-oauth/flow-init.middleware";
import CSRFMiddleware from "../util/csrf.middleware";
import { RegisterRedirectMiddleware } from "./register-redirect.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule, ApiOauthModule, ApiLoginModule],
    controllers: [AuthEndpointsController, UpdateActionController],
})
export class ApiInternalModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(FlowInitMiddleware, ModeExtractorMiddleware, StrategiesMiddleware)
            .forRoutes("auth/api/internal/auth/redirect/:id/:mode");

        consumer
            .apply(
                FlowInitMiddleware,
                StrategiesMiddleware,
                FlowSetAuthenticatedMiddleware,
                PromptRedirectMiddleware,
                RegisterRedirectMiddleware,
                CodeRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/callback/:id");

        consumer
            .apply(
                FlowInitMiddleware,
                ModeExtractorMiddleware,
                StrategiesMiddleware,
                FlowSetAuthenticatedMiddleware,
                PromptRedirectMiddleware,
                // TODO: register redirect middleware missing?
                CodeRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/submit/:id/:mode");

        consumer
            .apply(FlowInitMiddleware, PromptCallbackMiddleware, CodeRedirectMiddleware)
            .forRoutes("auth/api/internal/auth/prompt/callback");

        consumer
            .apply(
                FlowInitMiddleware,
                RegisterCallbackMiddleware,
                FlowSetAuthenticatedMiddleware,
                PromptRedirectMiddleware,
                CodeRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/register/callback");

        consumer.apply(FlowInitMiddleware).forRoutes("auth/api/internal/auth/csrf");

        consumer.apply(FlowInitMiddleware).forRoutes("auth/api/internal/auth/prompt/data");

        consumer.apply(FlowInitMiddleware, CSRFMiddleware).forRoutes("auth/api/internal/auth/logout/current");

        consumer.apply(FlowInitMiddleware, CSRFMiddleware).forRoutes("auth/api/internal/auth/logout/everywhere");
    }
}

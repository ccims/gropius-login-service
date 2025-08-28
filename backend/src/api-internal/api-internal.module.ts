import { MiddlewareConsumer, Module } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { ModeExtractorMiddleware } from "./mode-extractor.middleware";
import { StrategiesMiddleware } from "../strategies/strategies.middleware";
import { StrategiesModule } from "../strategies/strategies.module";
import { AuthEndpointsController } from "./auth-endpoints.controller";
import { CodeRedirectMiddleware } from "./auth-code-redirect-middleware.service";
import { ApiOauthModule } from "src/api-oauth/api-oauth.module";
import { RegisterMiddleware } from "./register-middleware.service";
import { ApiLoginModule } from "src/api-login/api-login.module";
import { UpdateActionController } from "./update-action.controller";
import { FlowSetAuthenticatedMiddleware } from "./flow-set-authenticated-middleware.service";
import { PromptRedirectMiddleware } from "./prompt-redirect-middleware.service";
import { PromptCallbackMiddleware } from "./prompt-callback-middleware.service";
import { FlowInitMiddleware } from "../api-oauth/flow-init-middleware.service";
import CSRFMiddleware from "../util/csrf.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule, ApiOauthModule, ApiLoginModule],
    controllers: [AuthEndpointsController, UpdateActionController],
})
export class ApiInternalModule {
    configure(consumer: MiddlewareConsumer) {
        // TODO: CSRF?
        consumer
            .apply(FlowInitMiddleware, ModeExtractorMiddleware, StrategiesMiddleware)
            .forRoutes("auth/api/internal/auth/redirect/:id/:mode");

        consumer
            .apply(
                FlowInitMiddleware,
                StrategiesMiddleware,
                FlowSetAuthenticatedMiddleware,
                PromptRedirectMiddleware,
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
                CodeRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/submit/:id/:mode");

        consumer
            .apply(FlowInitMiddleware, PromptCallbackMiddleware, CodeRedirectMiddleware)
            .forRoutes("auth/api/internal/auth/prompt/callback");

        // TODO: CSRF?
        // TODO: not tested
        consumer
            .apply(
                FlowInitMiddleware,
                RegisterMiddleware,
                FlowSetAuthenticatedMiddleware,
                PromptRedirectMiddleware,
                CodeRedirectMiddleware,
            )
            .forRoutes("auth/api/internal/auth/register/callback");

        consumer.apply(FlowInitMiddleware).forRoutes("auth/api/internal/auth/csrf");

        consumer.apply(FlowInitMiddleware).forRoutes("auth/api/internal/auth/csrf-external");

        consumer.apply(FlowInitMiddleware).forRoutes("auth/api/internal/auth/prompt/data");

        consumer.apply(FlowInitMiddleware, CSRFMiddleware).forRoutes("auth/api/internal/auth/logout/current");

        consumer.apply(FlowInitMiddleware, CSRFMiddleware).forRoutes("auth/api/internal/auth/logout/everywhere");
    }
}

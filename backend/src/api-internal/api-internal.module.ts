import { MiddlewareConsumer, Module, NestMiddleware } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { ErrorHandlerMiddleware } from "../api-oauth/error-handler.middleware";
import { ModeExtractorMiddleware } from "./mode-extractor.middleware";
import { StrategiesMiddleware } from "../strategies/strategies.middleware";
import { StrategiesModule } from "../strategies/strategies.module";
import { AuthEndpointsController } from "./auth-endpoints.controller";
import { AuthRedirectMiddleware } from "./auth-redirect.middleware";
import { ApiOauthModule } from "src/api-oauth/api-oauth.module";
import { OAuthErrorRedirectMiddleware } from "src/api-oauth/oauth-error-redirect.middleware";
import { AuthAuthorizeExtractMiddleware } from "./auth-authorize-extract.middleware";
import { OAuthAuthorizeValidateMiddleware } from "src/api-oauth/oauth-authorize-validate.middleware";
import { AuthRegisterMiddleware } from "./auth-register.middleware";
import { ApiLoginModule } from "src/api-login/api-login.module";
import { AuthErrorRedirectMiddleware } from "./auth-error-redirect.middleware";
import { UpdateActionController } from "./update-action.controller";
import { FlowSessionSetAuthenticatedMiddleware } from "./flow-session-set-authenticated.middleware.service";
import { AuthPromptRedirectMiddleware } from "./auth-prompt-redirect.middleware";
import { AuthPromptCallbackMiddleware } from "./auth-prompt-callback.middleware";
import { FlowSessionRestoreMiddleware } from "../api-oauth/flow-session-restore";
import { FlowSessionInitMiddleware } from "../api-oauth/flow-session-init";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule, ApiOauthModule, ApiLoginModule],
    providers: [
        AuthAuthorizeExtractMiddleware,
        AuthRedirectMiddleware,
        AuthRegisterMiddleware,
        ModeExtractorMiddleware,
        AuthErrorRedirectMiddleware,
        AuthPromptRedirectMiddleware,
        AuthPromptCallbackMiddleware,
        FlowSessionInitMiddleware,
        FlowSessionSetAuthenticatedMiddleware,
        FlowSessionRestoreMiddleware,
    ],
    controllers: [AuthEndpointsController, UpdateActionController],
})
export class ApiInternalModule {
    private middlewares: { middlewares: NestMiddleware[]; path: string }[] = [];

    constructor(
        private readonly authAuthorizeExtract: AuthAuthorizeExtractMiddleware,
        private readonly authRedirect: AuthRedirectMiddleware,
        private readonly modeExtractor: ModeExtractorMiddleware,
        private readonly strategies: StrategiesMiddleware,
        private readonly errorHandler: ErrorHandlerMiddleware,
        private readonly oauthErrorRedirect: OAuthErrorRedirectMiddleware,
        private readonly oauthAuthorizeValidate: OAuthAuthorizeValidateMiddleware,
        private readonly authRegister: AuthRegisterMiddleware,
        private readonly authErrorRedirect: AuthErrorRedirectMiddleware,
        private readonly promptRedirect: AuthPromptRedirectMiddleware,
        private readonly promptCallback: AuthPromptCallbackMiddleware,
        private readonly flowSessionInit: FlowSessionInitMiddleware,
        private readonly flowSessionSetAuthenticated: FlowSessionSetAuthenticatedMiddleware,
        private readonly flowSessionRestore: FlowSessionRestoreMiddleware,
    ) {
        this.middlewares.push({
            middlewares: [
                this.flowSessionInit,
                this.authAuthorizeExtract,
                this.oauthAuthorizeValidate,
                this.modeExtractor,
                this.strategies,
                this.authErrorRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/api/internal/auth/redirect/:id/:mode",
        });

        this.middlewares.push({
            middlewares: [
                this.flowSessionInit,
                this.strategies,
                this.flowSessionSetAuthenticated,
                this.promptRedirect,
                this.authRedirect,
                this.authErrorRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/api/internal/auth/callback/:id",
        });

        this.middlewares.push({
            middlewares: [
                this.flowSessionInit,
                this.authAuthorizeExtract,
                this.oauthAuthorizeValidate,
                this.modeExtractor,
                this.strategies,
                this.flowSessionSetAuthenticated,
                this.promptRedirect,
                this.authRedirect,
                this.authErrorRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/api/internal/auth/submit/:id/:mode",
        });

        this.middlewares.push({
            middlewares: [
                this.flowSessionInit,
                this.promptCallback,
                this.flowSessionRestore,
                this.authRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/api/internal/auth/prompt/callback",
        });

        // TODO: CSRF?
        this.middlewares.push({
            middlewares: [
                this.flowSessionInit,
                this.authAuthorizeExtract,
                this.oauthAuthorizeValidate,
                this.authRegister,
                this.flowSessionSetAuthenticated,
                this.promptRedirect,
                this.authRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/api/internal/auth/register",
        });

        this.middlewares.push({
            middlewares: [this.flowSessionInit],
            path: "auth/api/internal/auth/external-flow",
        });
    }

    configure(consumer: MiddlewareConsumer) {
        for (const chain of this.middlewares) {
            consumer.apply(...chain.middlewares.map((m) => m.use.bind(m))).forRoutes(chain.path);
        }
    }
}

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
import { AuthFlowSetAuthenticatedMiddleware } from "./auth-flow-set-authenticated-middleware.service";
import { AuthPromptRedirectMiddleware } from "./auth-prompt-redirect.middleware";
import { AuthPromptCallbackMiddleware } from "./auth-prompt-callback.middleware";
import { NoCorsMiddleware } from "./no-cors.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule, ApiOauthModule, ApiLoginModule],
    providers: [
        NoCorsMiddleware,
        AuthAuthorizeExtractMiddleware,
        AuthRedirectMiddleware,
        AuthRegisterMiddleware,
        ModeExtractorMiddleware,
        AuthErrorRedirectMiddleware,
        AuthFlowSetAuthenticatedMiddleware,
        AuthPromptRedirectMiddleware,
        AuthPromptCallbackMiddleware,
    ],
    controllers: [AuthEndpointsController, UpdateActionController],
})
export class ApiInternalModule {
    private middlewares: { middlewares: NestMiddleware[]; path: string }[] = [];

    constructor(
        private readonly noCors: NoCorsMiddleware,
        private readonly authAuthorizeExtract: AuthAuthorizeExtractMiddleware,
        private readonly authRedirect: AuthRedirectMiddleware,
        private readonly modeExtractor: ModeExtractorMiddleware,
        private readonly strategies: StrategiesMiddleware,
        private readonly flowSetAuthenticated: AuthFlowSetAuthenticatedMiddleware,
        private readonly errorHandler: ErrorHandlerMiddleware,
        private readonly oauthErrorRedirect: OAuthErrorRedirectMiddleware,
        private readonly oauthAuthorizeValidate: OAuthAuthorizeValidateMiddleware,
        private readonly authRegister: AuthRegisterMiddleware,
        private readonly authErrorRedirect: AuthErrorRedirectMiddleware,
        private readonly promptRedirect: AuthPromptRedirectMiddleware,
        private readonly promptCallback: AuthPromptCallbackMiddleware,
    ) {
        // TODO: adapt this to new prompt flow? (starts external oauth)
        this.middlewares.push({
            middlewares: [
                this.noCors,
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

        // TODO: rewrite this to new prompt flow (callback for external oauth)
        this.middlewares.push({
            middlewares: [
                this.noCors,
                this.strategies,
                this.oauthAuthorizeValidate,
                this.authRedirect,
                this.authErrorRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/api/internal/auth/callback/:id",
        });

        this.middlewares.push({
            middlewares: [
                this.noCors,
                this.authAuthorizeExtract,
                this.oauthAuthorizeValidate,
                this.modeExtractor,
                this.strategies,
                this.authErrorRedirect,
                this.oauthErrorRedirect,
                this.flowSetAuthenticated,
                this.promptRedirect,
                this.errorHandler,
            ],
            path: "auth/api/internal/auth/submit/:id/:mode",
        });

        this.middlewares.push({
            middlewares: [this.promptCallback, this.authRedirect, this.oauthErrorRedirect, this.errorHandler],
            path: "auth/api/internal/auth/prompt/callback",
        });

        // TODO: adapt this to new prompt flow?
        this.middlewares.push({
            middlewares: [
                this.noCors,
                this.authAuthorizeExtract,
                this.oauthAuthorizeValidate,
                this.authRegister,
                this.authRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/api/internal/auth/register",
        });
    }

    configure(consumer: MiddlewareConsumer) {
        for (const chain of this.middlewares) {
            consumer.apply(...chain.middlewares.map((m) => m.use.bind(m))).forRoutes(chain.path);
        }
    }
}

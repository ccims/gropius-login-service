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
import { AuthAutorizeExtractMiddleware } from "./auth-autorize-extract.middleware";
import { OAuthAuthorizeValidateMiddleware } from "src/api-oauth/oauth-authorize-validate.middleware";
import { AuthRegisterMiddleware } from "./auth-register.middleware";
import { AuthModule } from "src/api-login/api-login.module";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule, ApiOauthModule, AuthModule],
    providers: [AuthAutorizeExtractMiddleware, AuthRedirectMiddleware, AuthRegisterMiddleware, ModeExtractorMiddleware],
    controllers: [AuthEndpointsController],
})
export class ApiInternalModule {
    private middlewares: { middlewares: NestMiddleware[]; path: string }[] = [];

    constructor(
        private readonly authAutorizeExtract: AuthAutorizeExtractMiddleware,
        private readonly authRedirect: AuthRedirectMiddleware,
        private readonly modeExtractor: ModeExtractorMiddleware,
        private readonly strategies: StrategiesMiddleware,
        private readonly errorHandler: ErrorHandlerMiddleware,
        private readonly oauthErrorRedirect: OAuthErrorRedirectMiddleware,
        private readonly oauthAuthorizeValidate: OAuthAuthorizeValidateMiddleware,
        private readonly authRegister: AuthRegisterMiddleware,
    ) {
        this.middlewares.push({
            middlewares: [
                this.authAutorizeExtract,
                this.oauthAuthorizeValidate,
                this.modeExtractor,
                this.strategies,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/internal/auth/redirect/:id/:mode",
        });

        this.middlewares.push({
            middlewares: [
                this.strategies,
                this.oauthAuthorizeValidate,
                this.authRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/internal/auth/callback/:id",
        });

        this.middlewares.push({
            middlewares: [
                this.authAutorizeExtract,
                this.oauthAuthorizeValidate,
                this.modeExtractor,
                this.authRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/internal/auth/submit/:id/:mode",
        });

        this.middlewares.push({
            middlewares: [
                this.authAutorizeExtract,
                this.oauthAuthorizeValidate,
                this.authRegister,
                this.authRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/internal/auth/register",
        });
    }

    configure(consumer: MiddlewareConsumer) {
        for (const chain of this.middlewares) {
            consumer.apply(...chain.middlewares.map((m) => m.use.bind(m))).forRoutes(chain.path);
        }
    }
}

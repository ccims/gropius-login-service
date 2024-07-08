import { MiddlewareConsumer, Module, NestMiddleware } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { ErrorHandlerMiddleware } from "../api-oauth/error-handler.middleware";
import { ModeExtractorMiddleware } from "./mode-extractor.middleware";
import { StrategiesMiddleware } from "../strategies/strategies.middleware";
import { StrategiesModule } from "../strategies/strategies.module";
import { AuthAutorizeMiddleware } from "./auth-autorize.middleware";
import { AuthEndpointsController } from "./auth-endpoints.controller";
import { AuthRedirectMiddleware } from "./auth-redirect.middleware";
import { AuthTokenMiddleware } from "./auth-token.middleware";
import { PostCredentialsMiddleware } from "./post-credentials.middleware";
import { ApiOauthModule } from "src/api-oauth/api-oauth.module";
import { OAuthErrorRedirectMiddleware } from "src/api-oauth/oauth-error-redirect.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule, ApiOauthModule],
    providers: [AuthAutorizeMiddleware, AuthRedirectMiddleware, AuthTokenMiddleware, PostCredentialsMiddleware],
    controllers: [AuthEndpointsController],
})
export class ApiInternalModule {
    private middlewares: { middlewares: NestMiddleware[]; path: string }[] = [];

    constructor(
        private readonly authAutorize: AuthAutorizeMiddleware,
        private readonly authRedirect: AuthRedirectMiddleware,
        private readonly authToken: AuthTokenMiddleware,
        private readonly modeExtractor: ModeExtractorMiddleware,
        private readonly strategies: StrategiesMiddleware,
        private readonly errorHandler: ErrorHandlerMiddleware,
        private readonly oauthErrorRedirect: OAuthErrorRedirectMiddleware,
    ) {
        this.middlewares.push({
            middlewares: [
                this.modeExtractor,
                this.authAutorize,
                this.strategies,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "internal/auth/redirect/:id/:mode",
        });

        this.middlewares.push({
            middlewares: [this.strategies, this.authRedirect, this.oauthErrorRedirect, this.errorHandler],
            path: "internal/auth/callback/:id",
        });

        this.middlewares.push({
            middlewares: [this.modeExtractor, this.authToken, this.errorHandler],
            path: "internal/auth/submit/:id/:mode",
        });
    }

    configure(consumer: MiddlewareConsumer) {
        for (const chain of this.middlewares) {
            consumer.apply(...chain.middlewares.map((m) => m.use.bind(m))).forRoutes(chain.path);
        }
    }
}

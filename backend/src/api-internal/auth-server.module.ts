import { MiddlewareConsumer, Module, NestMiddleware } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { ErrorHandlerMiddleware } from "../strategies/error-handler.middleware";
import { ModeExtractorMiddleware } from "../strategies/mode-extractor.middleware";
import { StrategiesMiddleware } from "../strategies/strategies.middleware";
import { StrategiesModule } from "../strategies/strategies.module";
import { AuthAutorizeMiddleware } from "./auth-autorize.middleware";
import { OauthEndpointsController } from "./auth-endpoints.controller";
import { OauthRedirectMiddleware } from "./auth-redirect.middleware";
import { AuthTokenController } from "./auth-token.controller";
import { OauthTokenMiddleware } from "./auth-token.middleware";
import { PostCredentialsMiddleware } from "./post-credentials.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    providers: [
        AuthAutorizeMiddleware,
        OauthRedirectMiddleware,
        OauthTokenMiddleware,
        PostCredentialsMiddleware,
    ],
    controllers: [AuthTokenController, OauthEndpointsController],
})
export class AuthServerModule {
    private middlewares: { middlewares: NestMiddleware[]; path: string }[] = [];

    constructor(
        private readonly oauthAutorize: AuthAutorizeMiddleware,
        private readonly oauthRedirect: OauthRedirectMiddleware,
        private readonly oauthToken: OauthTokenMiddleware,
        private readonly modeExtractor: ModeExtractorMiddleware,
        private readonly strategies: StrategiesMiddleware,
        private readonly errorHandler: ErrorHandlerMiddleware,
    ) {
        this.middlewares.push({
            middlewares: [
                this.modeExtractor,
                this.oauthAutorize,
                this.strategies,
                this.oauthRedirect,
                // This middleware should never be reached as the oauth middleware should already care about it,
                // its just to make absolutely sure, no unauthorized request gets through
                this.errorHandler,
            ],
            path: "internal/auth/redirect/:id/:mode",
        });

        this.middlewares.push({
            middlewares: [this.strategies, this.oauthRedirect, this.errorHandler],
            path: "internal/auth/callback/:id",
        });

        this.middlewares.push({
            middlewares: [this.modeExtractor, this.oauthToken, this.errorHandler],
            path: "internal/auth/submit/:id/:mode",
        });
    }

    configure(consumer: MiddlewareConsumer) {
        for (const chain of this.middlewares) {
            consumer.apply(...chain.middlewares.map((m) => m.use.bind(m))).forRoutes(chain.path);
        }
    }
}

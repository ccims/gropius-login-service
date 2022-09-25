import { MiddlewareConsumer, Module, NestMiddleware } from "@nestjs/common";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { ModelModule } from "src/model/model.module";
import { ErrorHandlerMiddleware } from "../strategies/error-handler.middleware";
import { ModeExtractorMiddleware } from "../strategies/mode-extractor.middleware";
import { StrategiesMiddleware } from "../strategies/strategies.middleware";
import { StrategiesModule } from "../strategies/strategies.module";
import { OauthAutorizeMiddleware } from "./oauth-autorize.middleware";
import { OauthEndpointsController } from "./oauth-endpoints.controller";
import { OauthRedirectMiddleware } from "./oauth-redirect.middleware";
import { OauthTokenController } from "./oauth-token.controller";
import { OauthTokenMiddleware } from "./oauth-token.middleware";
import { PostCredentialsMiddleware } from "./post-credentials.middleware";
import { TokenAuthorizationCodeMiddleware } from "./token-authorization-code.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    providers: [
        OauthAutorizeMiddleware,
        OauthRedirectMiddleware,
        OauthTokenMiddleware,
        TokenAuthorizationCodeMiddleware,
        PostCredentialsMiddleware,
    ],
    controllers: [OauthTokenController, OauthEndpointsController],
})
export class OauthServerModule {
    private middlewares: { middlewares: NestMiddleware[]; path: string }[] = [];

    constructor(
        private readonly oauthAutorize: OauthAutorizeMiddleware,
        private readonly oauthRedirect: OauthRedirectMiddleware,
        private readonly oauthToken: OauthTokenMiddleware,
        private readonly tokenAuthorizationCode: TokenAuthorizationCodeMiddleware,
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
            path: "strategy/oauth/:id/authorize/:mode?",
        });

        this.middlewares.push({
            middlewares: [this.strategies, this.oauthRedirect, this.errorHandler],
            path: "strategy/oauth/:id/callback",
        });

        this.middlewares.push({
            middlewares: [this.modeExtractor, this.oauthToken, this.errorHandler],
            path: "strategy/oauth/:id?/token/:mode?",
        });
    }

    configure(consumer: MiddlewareConsumer) {
        for (const chain of this.middlewares) {
            consumer.apply(...chain.middlewares.map((m) => m.use.bind(m))).forRoutes(chain.path);
        }
    }
}

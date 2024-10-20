import { MiddlewareConsumer, Module, NestMiddleware } from "@nestjs/common";
import { ModelModule } from "src/model/model.module";
import { OAuthAuthorizeExtractMiddleware } from "./oauth-authorize-extract.middleware";
import { OauthTokenMiddleware as OAuthTokenMiddleware } from "./oauth-token.middleware";
import { OAuthTokenAuthorizationCodeMiddleware } from "./oauth-token-authorization-code.middleware";
import { OauthAuthorizeController as OAuthAuthorizeController } from "./oauth-authorize.controller";
import { OAuthTokenController } from "./oauth-token.controller";
import { OAuthAuthorizeValidateMiddleware } from "./oauth-authorize-validate.middleware";
import { OAuthAuthorizeRedirectMiddleware } from "./oauth-authorize-redirect.middleware";
import { ErrorHandlerMiddleware } from "./error-handler.middleware";
import { OAuthErrorRedirectMiddleware } from "./oauth-error-redirect.middleware";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { StrategiesModule } from "src/strategies/strategies.module";
import { EncryptionService } from "./encryption.service";
import { OAuthTokenClientCredentialsMiddleware } from "./oauth-token-client-credentials.middleware";

@Module({
    imports: [ModelModule, BackendServicesModule, StrategiesModule],
    providers: [
        OAuthAuthorizeExtractMiddleware,
        OAuthAuthorizeValidateMiddleware,
        OAuthAuthorizeRedirectMiddleware,
        OAuthTokenMiddleware,
        OAuthTokenAuthorizationCodeMiddleware,
        OAuthTokenClientCredentialsMiddleware,
        ErrorHandlerMiddleware,
        OAuthErrorRedirectMiddleware,
        EncryptionService,
    ],
    controllers: [OAuthAuthorizeController, OAuthTokenController],
    exports: [OAuthAuthorizeValidateMiddleware, ErrorHandlerMiddleware, OAuthErrorRedirectMiddleware],
})
export class ApiOauthModule {
    private middlewares: { middlewares: NestMiddleware[]; path: string }[] = [];

    constructor(
        private readonly oauthAuthorizeExtract: OAuthAuthorizeExtractMiddleware,
        private readonly oauthAuthorizeValidate: OAuthAuthorizeValidateMiddleware,
        private readonly oauthAuthorizeRedirect: OAuthAuthorizeRedirectMiddleware,
        private readonly oauthToken: OAuthTokenMiddleware,
        private readonly errorHandler: ErrorHandlerMiddleware,
        private readonly oauthErrorRedirect: OAuthErrorRedirectMiddleware,
    ) {
        this.middlewares.push({
            middlewares: [
                this.oauthAuthorizeExtract,
                this.oauthAuthorizeValidate,
                this.oauthAuthorizeRedirect,
                this.oauthErrorRedirect,
                this.errorHandler,
            ],
            path: "auth/oauth/authorize",
        });

        this.middlewares.push({
            middlewares: [this.oauthToken, this.errorHandler],
            path: "auth/oauth/token",
        });
    }

    configure(consumer: MiddlewareConsumer) {
        for (const chain of this.middlewares) {
            consumer.apply(...chain.middlewares.map((m) => m.use.bind(m))).forRoutes(chain.path);
        }
    }
}

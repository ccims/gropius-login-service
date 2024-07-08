import { MiddlewareConsumer, Module, NestMiddleware } from "@nestjs/common";
import { ModelModule } from "src/model/model.module";
import { OAuthAuthorizeExtractMiddleware } from "./oauth-authorize-extract.middleware";
import { OauthTokenMiddleware as OAuthTokenMiddleware } from "./oauth-token.middleware";
import { OAuthTokenAuthorizationCodeMiddleware } from "./oauth-token-authorization-code.middleware";
import { OauthAuthorizeController as OAuthAuthorizeController } from "./oauth-authorize.controller";
import { OAuthTokenController } from "./oauth-token.controller";
import { OAuthAuthorizeValidateMiddleware } from "./oauth-authorize-validate.middleware";
import { OAuthAuthorizeRedirectMiddleware } from "./oauth-authorize-redirect.middleware";

@Module({
    imports: [ModelModule],
    providers: [
        OAuthAuthorizeExtractMiddleware,
        OAuthAuthorizeValidateMiddleware,
        OAuthAuthorizeRedirectMiddleware,
        OAuthTokenMiddleware,
        OAuthTokenAuthorizationCodeMiddleware,
    ],
    controllers: [OAuthAuthorizeController, OAuthTokenController],
})
export class ApiOauthModule {
    private middlewares: { middlewares: NestMiddleware[]; path: string }[] = [];

    constructor(
        private readonly oauthAuthorizeExtract: OAuthAuthorizeExtractMiddleware,
        private readonly oauthAuthorizeValidate: OAuthAuthorizeValidateMiddleware,
        private readonly oauthAuthorizeRedirect: OAuthAuthorizeRedirectMiddleware,
        private readonly oauthToken: OAuthTokenMiddleware,
        private readonly oauthTokenAuthorizationCode: OAuthTokenAuthorizationCodeMiddleware,
    ) {
        this.middlewares.push({
            middlewares: [this.oauthAuthorizeExtract, this.oauthAuthorizeValidate, this.oauthAuthorizeRedirect],
            path: "oauth/authorize",
        });

        this.middlewares.push({
            middlewares: [this.oauthToken, this.oauthTokenAuthorizationCode],
            path: "oauth/token",
        });
    }

    configure(consumer: MiddlewareConsumer) {
        for (const chain of this.middlewares) {
            consumer.apply(...chain.middlewares.map((m) => m.use.bind(m))).forRoutes(chain.path);
        }
    }
}

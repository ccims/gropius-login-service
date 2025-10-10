import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ModelModule } from "src/model/model.module";
import { TokenService } from "./token.service";
import { BackendUserService } from "./backend-user.service";
import { ImsUserFindingService } from "./ims-user-finding.service";
import { EncryptionService } from "./encryption.service";
import { CodeRedirectService } from "./x-code-redirect.service";
import { FlowInitService } from "./x-flow-init.service";
import { PromptRedirectService } from "./x-prompt-redirect.service";
import { RequestExtractService } from "./x-request-extract.service";
import { TokenExchangeAuthorizationCodeService } from "./x-token-exchange-authorization-code.service";
import { TokenExchangeClientCredentialsService } from "./x-token-exchange-client-credentials.service";
import { CSRFService } from "./x-csrf.service";
import { LoginRedirectService } from "./x-login-redirect.service";

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory(...args) {
                return {
                    privateKey: atob(process.env.GROPIUS_OAUTH_PRIVATE_KEY),
                    publicKey: atob(process.env.GROPIUS_OAUTH_PUBLIC_KEY),
                    signOptions: {
                        issuer: process.env.GROPIUS_JWT_ISSUER,
                        audience: ["backend", "login"],
                        algorithm: "RS256",
                    },
                    verifyOptions: {
                        issuer: process.env.GROPIUS_JWT_ISSUER,
                        audience: "login",
                    },
                };
            },
        }),
        ModelModule,
    ],
    providers: [
        { provide: "BackendJwtService", useExisting: JwtService },
        TokenService,
        BackendUserService,
        ImsUserFindingService,
        EncryptionService,
        CodeRedirectService,
        FlowInitService,
        PromptRedirectService,
        RequestExtractService,
        TokenExchangeAuthorizationCodeService,
        TokenExchangeClientCredentialsService,
        CSRFService,
        LoginRedirectService,
    ],
    exports: [
        TokenService,
        BackendUserService,
        ImsUserFindingService,
        EncryptionService,
        CodeRedirectService,
        FlowInitService,
        PromptRedirectService,
        RequestExtractService,
        TokenExchangeAuthorizationCodeService,
        TokenExchangeClientCredentialsService,
        CSRFService,
        LoginRedirectService,
    ],
})
export class BackendServicesModule {}

import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ModelModule } from "src/model/model.module";
import { TokenService } from "./token.service";
import { BackendUserService } from "./backend-user.service";
import { ImsUserFindingService } from "./ims-user-finding.service";
import { EncryptionService } from "./encryption.service";
import { CodeRedirectService } from "./x-code-redirect.service";
import { ContextInitService } from "./x-context-init.service";
import { PromptRedirectService } from "./x-prompt-redirect.service";
import { RequestExtractService } from "./x-request-extract.service";
import { TokenExchangeAuthorizationCodeService } from "./x-token-exchange-authorization-code.service";
import { TokenExchangeClientCredentialsService } from "./x-token-exchange-client-credentials.service";
import { AuthCSRFService } from "./x-auth-csrf.service";
import { LoginRedirectService } from "./x-login-redirect.service";
import { PromptCallbackService } from "./x-prompt-callback.service";
import { FlowViaService } from "./x-flow-via.service";
import { AuthUserService } from "./x-auth-user.service";
import { RegisterRedirectService } from "./x-register-redirect.service";
import { RegisterCallbackService } from "./x-register-callback.service";
import { FlowCSRFService } from "./x-flow-csrf.service";
import { TokenExchangeRefreshTokenService } from "./x-token-exchange-refresh-token.service";
import { FlowStateService } from "./x-flow-state.service";

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
        ContextInitService,
        PromptRedirectService,
        RequestExtractService,
        TokenExchangeAuthorizationCodeService,
        TokenExchangeClientCredentialsService,
        AuthCSRFService,
        LoginRedirectService,
        PromptCallbackService,
        FlowViaService,
        AuthUserService,
        RegisterRedirectService,
        RegisterCallbackService,
        FlowCSRFService,
        TokenExchangeRefreshTokenService,
        FlowStateService,
    ],
    exports: [
        TokenService,
        BackendUserService,
        ImsUserFindingService,
        EncryptionService,
        CodeRedirectService,
        ContextInitService,
        PromptRedirectService,
        RequestExtractService,
        TokenExchangeAuthorizationCodeService,
        TokenExchangeClientCredentialsService,
        AuthCSRFService,
        LoginRedirectService,
        PromptCallbackService,
        FlowViaService,
        AuthUserService,
        RegisterRedirectService,
        RegisterCallbackService,
        FlowCSRFService,
        TokenExchangeRefreshTokenService,
        FlowStateService,
    ],
})
export class BackendServicesModule {}

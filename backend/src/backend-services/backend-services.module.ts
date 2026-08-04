import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ModelModule } from "../model/model.module.js";
import { TokenService } from "./token.service.js";
import { BackendUserService } from "./backend-user.service.js";
import { ImsUserFindingService } from "./ims-user-finding.service.js";
import { EncryptionService } from "./encryption.service.js";
import { CodeRedirectService } from "./x-code-redirect.service.js";
import { ContextInitService } from "./x-context-init.service.js";
import { PromptRedirectService } from "./x-prompt-redirect.service.js";
import { RequestExtractService } from "./x-request-extract.service.js";
import { TokenExchangeAuthorizationCodeService } from "./x-token-exchange-authorization-code.service.js";
import { TokenExchangeClientCredentialsService } from "./x-token-exchange-client-credentials.service.js";
import { AuthCSRFService } from "./x-auth-csrf.service.js";
import { LoginRedirectService } from "./x-login-redirect.service.js";
import { PromptCallbackService } from "./x-prompt-callback.service.js";
import { FlowViaService } from "./x-flow-via.service.js";
import { AuthUserService } from "./x-auth-user.service.js";
import { RegisterRedirectService } from "./x-register-redirect.service.js";
import { RegisterCallbackService } from "./x-register-callback.service.js";
import { FlowCSRFService } from "./x-flow-csrf.service.js";
import { TokenExchangeRefreshTokenService } from "./x-token-exchange-refresh-token.service.js";
import { FlowStateService } from "./x-flow-state.service.js";
import { LinkCallbackService } from "./x-link-callback.service.js";

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
                        // Pinned so verification cannot be talked into another algorithm family.
                        algorithms: ["RS256"],
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
        LinkCallbackService,
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
        LinkCallbackService,
    ],
})
export class BackendServicesModule {}

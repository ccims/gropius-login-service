import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ModelModule } from "../model/model.module.js";
import { PerformAuthFunctionService } from "./perform-auth-function.service.js";
import { StrategiesService } from "./strategies.service.js";
import { UserpassStrategyService } from "./userpass/userpass.service.js";
import { BackendServicesModule } from "../backend-services/backend-services.module.js";
import { GithubStrategyService } from "./github/github.service.js";
import { JiraStrategyService } from "./jira/jira.service.js";
import { GithubTokenStrategyService } from "./github-token/github-token.service.js";
import { JiraTokenCloudStrategyService } from "./jira-token-cloud/jira-token-cloud.service.js";
import { JiraTokenDatacenterStrategyService } from "./jira-token-datacenter/jira-token-datacenter.service.js";
import { PasskeyStrategyService } from "./passkey/passkey.service.js";

@Module({
    imports: [
        ModelModule,
        JwtModule.registerAsync({
            useFactory(...args) {
                return {
                    privateKey: atob(process.env.GROPIUS_LOGIN_SPECIFIC_PRIVATE_KEY),
                    publicKey: atob(process.env.GROPIUS_LOGIN_SPECIFIC_PUBLIC_KEY),
                    signOptions: {
                        issuer: process.env.GROPIUS_PASSPORT_STATE_JWT_ISSUER,
                        algorithm: "RS256",
                    },
                    verifyOptions: {
                        issuer: process.env.GROPIUS_PASSPORT_STATE_JWT_ISSUER,
                        algorithms: ["RS256"],
                    },
                };
            },
        }),
        BackendServicesModule,
    ],
    controllers: [],
    providers: [
        PerformAuthFunctionService,
        UserpassStrategyService,
        PasskeyStrategyService,
        GithubStrategyService,
        JiraStrategyService,
        GithubTokenStrategyService,
        JiraTokenCloudStrategyService,
        JiraTokenDatacenterStrategyService,
        { provide: "StateJwtService", useExisting: JwtService },
        StrategiesService,
    ],
    exports: [
        StrategiesService,
        PasskeyStrategyService,
        { provide: "StateJwtService", useExisting: JwtService },
        PerformAuthFunctionService,
    ],
})
export class StrategiesModule {}

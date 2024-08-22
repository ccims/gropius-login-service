import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ModelModule } from "src/model/model.module";
import { PerformAuthFunctionService } from "./perform-auth-function.service";
import { StrategiesMiddleware } from "./strategies.middleware";
import { UserpassStrategyService } from "./userpass/userpass.service";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { GithubStrategyService } from "./github/github.service";
import { JiraStrategyService } from "./jira/jira.service";
import { GithubTokenStrategyService } from "./github-token/github-token.service";
import { JiraTokenCloudStrategyService } from "./jira-token-cloud/jira-token-cloud.service";
import { JiraTokenDatacenterStrategyService } from "./jira-token-datacenter/jira-token-datacenter.service";

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
        GithubStrategyService,
        JiraStrategyService,
        GithubTokenStrategyService,
        JiraTokenCloudStrategyService,
        JiraTokenDatacenterStrategyService,
        { provide: "StateJwtService", useExisting: JwtService },
        StrategiesMiddleware,
    ],
    exports: [StrategiesMiddleware, { provide: "StateJwtService", useExisting: JwtService }],
})
export class StrategiesModule {}

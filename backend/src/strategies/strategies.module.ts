import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ModelModule } from "src/model/model.module";
import { PerformAuthFunctionService } from "./perform-auth-function.service";
import { StrategiesMiddleware } from "./strategies.middleware";
import { UserpassStrategyService } from "./userpass/userpass.service";
import { BackendServicesModule } from "src/backend-services/backend-services.module";
import { GithubStrategyService } from "./github/github.service";
import { JiraStrategyService } from "./jira/jira.service";

@Module({
    imports: [
        ModelModule,
        JwtModule.registerAsync({
            useFactory(...args) {
                return {
                    secret: process.env.GROPIUS_LOGIN_SPECIFIC_JWT_SECRET || "blabla",
                    signOptions: {
                        issuer: process.env.GROPIUS_PASSPORT_STATE_JWT_ISSUER,
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
        { provide: "PassportStateJwt", useExisting: JwtService },
        StrategiesMiddleware,
    ],
    exports: [StrategiesMiddleware],
})
export class StrategiesModule {}

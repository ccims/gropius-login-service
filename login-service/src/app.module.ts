import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LazyModuleLoader, RouterModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiLoginModule } from "./api-login/api-login.module";
import { ApiSyncModule } from "./api-sync/api-sync.module";
import { ModelModule } from "./model/model.module";
import { StrategiesModule } from "./strategies/strategies.module";
import { BackendServicesModule } from "./backend-services/backend-services.module";
import { validationSchema } from "./configuration-validator";
import { OauthServerModule } from "./oauth-server/oauth-server.module";
import { DefaultReturn } from "./default-return.dto";
import { InitializationModule } from "./initialization/initialization.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath:
                process.env.NODE_ENV === "production"
                    ? [".env.prod.local", ".env.prod"]
                    : [".env.dev.local", ".env.dev"],
            validationSchema,
        }),
        TypeOrmModule.forRootAsync({
            async useFactory(...args) {
                await ConfigModule.envVariablesLoaded;
                const driver = process.env.GROPIUS_LOGIN_DATABASE_DRIVER;
                if (!driver || driver == "postgres") {
                    return {
                        type: "postgres",
                        host: process.env.GROPIUS_LOGIN_DATABASE_HOST,
                        port: parseInt(process.env.GROPIUS_LOGIN_DATABASE_PORT, 10),
                        username: process.env.GROPIUS_LOGIN_DATABASE_USER,
                        password: process.env.GROPIUS_LOGIN_DATABASE_PASSWORD,
                        database: process.env.GROPIUS_LOGIN_DATABASE_DATABASE,
                        synchronize: process.env.NODE_ENV !== "production",
                        autoLoadEntities: true,
                    };
                } else if (driver == "sqlite") {
                    return {
                        type: "sqlite",
                        database: process.env.GROPIUS_LOGIN_DATABASE_DATABASE + ".sqlite",
                    };
                } else {
                    return {};
                }
            },
        }),
        ModelModule,
        ApiLoginModule,
        ApiSyncModule,
        StrategiesModule,
        OauthServerModule,
        RouterModule.register([
            { path: "login", module: ApiLoginModule },
            { path: "login", module: StrategiesModule },
            { path: "syncApi", module: ApiSyncModule },
            { path: "strategy", module: OauthServerModule },
        ]),
        BackendServicesModule,
        InitializationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

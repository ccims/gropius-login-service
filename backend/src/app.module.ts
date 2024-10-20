import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiLoginModule } from "./api-login/api-login.module";
import { ApiSyncModule } from "./api-sync/api-sync.module";
import { ModelModule } from "./model/model.module";
import { StrategiesModule } from "./strategies/strategies.module";
import { BackendServicesModule } from "./backend-services/backend-services.module";
import { validationSchema } from "./configuration-validator";
import { ApiInternalModule } from "./api-internal/api-internal.module";
import { InitializationModule } from "./initialization/initialization.module";
import * as path from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ApiOauthModule } from "./api-oauth/api-oauth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ["development", "testing"].includes(process.env.NODE_ENV)
                ? [".env.dev.local", ".env.dev"]
                : [".env.prod.local", ".env.prod"],
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
                        synchronize: process.env.NODE_ENV === "development",
                        autoLoadEntities: true,
                        migrations: [path.join(__dirname, "..", "dist", "database-migrations", "*.js")],
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
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, "..", "static"),
            serveRoot: "/auth/flow",
        }),
        ModelModule,
        ApiLoginModule,
        ApiSyncModule,
        StrategiesModule,
        ApiInternalModule,
        ApiOauthModule,
        RouterModule.register([
            { path: "auth/api/login", module: ApiLoginModule },
            { path: "auth/api/sync", module: ApiSyncModule },
            { path: "auth/api/internal", module: ApiInternalModule },
            { path: "auth/oauth", module: ApiOauthModule },
        ]),
        BackendServicesModule,
        InitializationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ApiLoginModule } from "./api-login/api-login.module";
import { ApiSyncModule } from "./api-sync/api-sync.module";
import { ModelModule } from "./model/model.module";
import { StrategiesModule } from "./strategies/strategies.module";
import { BackendServicesModule } from "./backend-services/backend-services.module";
import { validationSchema } from "./util/configuration-validator";
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
        // Baseline throttle for every endpoint, so credential and token endpoints cannot be
        // hammered. Per-route limits are tightened with @Throttle where it matters.
        ThrottlerModule.forRootAsync({
            async useFactory() {
                await ConfigModule.envVariablesLoaded;
                return {
                    throttlers: [
                        {
                            ttl: parseInt(process.env.GROPIUS_RATE_LIMIT_TTL_MS, 10),
                            limit: parseInt(process.env.GROPIUS_RATE_LIMIT_REQUESTS, 10),
                        },
                    ],
                };
            },
        }),
        TypeOrmModule.forRootAsync({
            async useFactory(...args): Promise<TypeOrmModuleOptions> {
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
                    // TypeORM 1.x dropped the node-sqlite3 based "sqlite" driver.
                    // The config value stays "sqlite"; it now maps to better-sqlite3.
                    return {
                        type: "better-sqlite3",
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
    providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

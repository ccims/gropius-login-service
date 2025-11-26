import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { OpenApiTag } from "./util/openapi-tag";
import { ConfigModule } from "@nestjs/config";
import { LogLevel } from "@nestjs/common";
import session = require("cookie-session");
import { NextFunction, Request, Response } from "express";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const logLevels = ["log", "error", "warn"];
    if (["development", "testing"].includes(process.env.NODE_ENV)) {
        logLevels.push("debug", "verbose");
    }

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: logLevels as LogLevel[],
    });

    await ConfigModule.envVariablesLoaded;
    const config = app.get(ConfigService);

    if (
        (process.env.GROPIUS_LOGIN_ENABLE_OPENAPI as unknown) != false &&
        process.env.GROPIUS_LOGIN_ENABLE_OPENAPI != "false"
    ) {
        const openApiConfig = new DocumentBuilder()
            .setTitle("Gropius Login Service")
            .setDescription("API for login, registration and linking Gropius accounts to accounts on IMSs")
            .addTag(OpenApiTag.LOGIN_API, "Endpoints to interact with the model, register and link authentications")
            .addTag(OpenApiTag.SYNC_API, "API to be used by sync services for exchanging IMSUser info")
            .addTag(OpenApiTag.OAUTH_API, "OAuth endpoints for authorization and token management")
            .addTag(OpenApiTag.INTERNAL_API, "Internal API, not meant to be used by clients")
            .addOAuth2({
                type: "oauth2",
                description: "Access token provided by running the oauth flow (and if needed) registering/linking",
                bearerFormat: "JWT",
            })
            .addBearerAuth({
                type: "apiKey",
                description: "Access token provided after running the oauth flow (and if needed registering/linking)",
            })
            .addApiKey({
                name: OpenApiTag.SYNC_API,
                type: "apiKey",
                description: "Secret Text shared between sync services and login service",
            })
            .build();
        let runningIndex = 0;
        const openApiDocument = SwaggerModule.createDocument(app, openApiConfig, {
            operationIdFactory(controllerKey, methodKey) {
                runningIndex = (runningIndex + 1) % (Number.MAX_SAFE_INTEGER - 1);
                return controllerKey + "_" + methodKey + "_" + runningIndex;
            },
        });
        SwaggerModule.setup("login-api-doc", app, openApiDocument);
    }

    const portNumber = parseInt(process.env.GROPIUS_LOGIN_LISTEN_PORT, 10) || 3000;

    app.enableCors();

    app.set("trust proxy", config.get<string | number | boolean>("GROPIUS_LOGIN_TRUST_PROXY"));

    app.use(
        session({
            name: "gropius-login-session",
            secret: config.get<string>("GROPIUS_LOGIN_SESSION_SECRET"),
            // "/auth/api/internal" and "/auth/oauth/authorize" need the cookie but "/auth/flow" not ...
            path: "/auth",
            httpOnly: true,
            // "strict" would prohibit the cookie being sent along when redirecting back from an IMS auth server
            sameSite: "lax",
            // expects HTTPS and, hence, the proxy itself must forward the protocol etc correctly and the upstream must trust the proxy
            secure: config.get<boolean>("GROPIUS_LOGIN_COOKIE_SECURE"),
            // no need to set "domain" since the default is already the most restrictive (in fact more restrictive than setting "domain" to the current domain)
        }),
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (!res.locals) {
            res.locals = {};
        }
        if (!res.locals.state) {
            res.locals.state = {};
        }

        next();
    });

    await app.listen(portNumber);
}

bootstrap().catch((err) => console.error("NestJS Application exited with error", err));

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { OpenApiTag } from "./openapi-tag";
import { ConfigModule } from "@nestjs/config";
import { LogLevel } from "@nestjs/common";
import session = require("cookie-session");
import * as State from "./util/State";

async function bootstrap() {
    const logLevels = ["log", "error", "warn"];
    if (["development", "testing"].includes(process.env.NODE_ENV)) {
        logLevels.push("debug", "verbose");
    }

    const app = await NestFactory.create(AppModule, {
        logger: logLevels as LogLevel[],
    });

    await ConfigModule.envVariablesLoaded;

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

    // TODO: configure proxy
    // app.set('trust proxy', 1)

    app.use(
        session({
            name: "gropius-login-session",
            // TODO: secret
            secret: "SOME_SECRET",
            // TODO: which path?
            path: "/auth",
            httpOnly: true,
            // TODO: make this
            sameSite: false,
            // TODO: make this true in prod
            secure: false,
        }),
    );

    app.use(State.middleware);

    await app.listen(portNumber);
}

bootstrap().catch((err) => console.error("NestJS Application exited with error", err));

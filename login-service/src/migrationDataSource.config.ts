import { DataSource } from "typeorm";
import { randomBytes } from "crypto";

function setEnvVariables() {
    process.env.GROPIUS_INTERNAL_BACKEND_JWT_SECRET = randomBytes(100).toString("base64");
    process.env.GROPIUS_LOGIN_SPECIFIC_JWT_SECRET = randomBytes(100).toString("base64");
    process.env.GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS = "10";
}

async function getDataSource(): Promise<DataSource> {
    console.log(
        "NOTICE: Make sure to run migrations with NODE_ENV set to the value for which " +
            "you want to initiaize your database and have configured your database settings.\n" +
            "E.g. if you have your DB settings in .env.dev, set NODE_ENV=testing",
    );

    setEnvVariables();

    const { NestFactory } = await import("@nestjs/core");
    const { AppModule } = await import("./app.module");
    const { ConfigModule } = await import("@nestjs/config");

    const app = await NestFactory.create(AppModule, {
        logger: ["error", "warn"],
    });

    setEnvVariables();

    await ConfigModule.envVariablesLoaded;

    setEnvVariables();

    const source = app.get(DataSource);

    await app.close();

    return source;
}

export default getDataSource();

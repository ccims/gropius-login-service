import { DataSource } from "typeorm";

async function getDataSource(): Promise<DataSource> {
    console.log(
        "NOTICE: Make sure to run migrations with NODE_ENV set to the value for which " +
            "you want to initiaize your database and have configured your database settings.\n" +
            "E.g. if you have your DB settings in .env.dev, set NODE_ENV=testing",
    );

    const { NestFactory } = await import("@nestjs/core");
    const { AppModule } = await import("../app.module");
    const { ConfigModule } = await import("@nestjs/config");

    const app = await NestFactory.create(AppModule, {
        logger: ["error", "warn", "log"],
    });

    await ConfigModule.envVariablesLoaded;

    const source = app.get(DataSource);

    await app.close();

    return source;
}

export default getDataSource();

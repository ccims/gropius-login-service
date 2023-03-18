import { DataSource } from "typeorm";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigModule } from "@nestjs/config";

async function getDataSource(): Promise<DataSource> {
    process.env.NODE_ENV = "production";

    const app = await NestFactory.create(AppModule, {
        logger: ["error", "warn"],
    });

    process.env.NODE_ENV = "production";

    await ConfigModule.envVariablesLoaded;

    process.env.NODE_ENV = "production";

    const source = app.get(DataSource);

    await app.close();

    return source;
}

export default getDataSource();

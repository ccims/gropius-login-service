import { DataSource, EntityManager, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { TokenScope } from "./backend-services/token.service";
import { OpenApiTag } from "./openapi-tag";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserLoginData } from "./model/postgres/UserLoginData.entity";

/* if (process.env.NODE_ENV === "production") {
    config({ path: ".env.prod.local", override: false });
    config({ path: ".env.prod", override: false });
} else {
    config({ path: ".env.dev.local", override: false });
    config({ path: ".env.dev", override: false });
} */

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

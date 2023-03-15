import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1677166222710 implements MigrationInterface {
    name = 'migration1677166222710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth_client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "redirectUrls" json NOT NULL, "clientSecrets" json NOT NULL, "isValid" boolean NOT NULL, "requiresSecret" boolean NOT NULL, CONSTRAINT "PK_2bf40f6fdea0aba0292591d5d7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "strategy_instance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "instanceConfig" jsonb NOT NULL, "type" character varying NOT NULL, "isLoginActive" boolean NOT NULL, "isSelfRegisterActive" boolean NOT NULL, "isSyncActive" boolean NOT NULL, "doesImplicitRegister" boolean NOT NULL, CONSTRAINT "PK_52c086dc8bf2108d16a07c53bda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "login_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "neo4jId" character varying, "username" character varying NOT NULL, "revokeTokensBefore" TIMESTAMP NOT NULL, CONSTRAINT "UQ_cf2a3a2259c6125ba7cfa99f22f" UNIQUE ("neo4jId"), CONSTRAINT "UQ_d81ec461bbcd8cccda1d5b59740" UNIQUE ("username"), CONSTRAINT "PK_6da2fec3d330c1b6c67c427937e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_login_data_ims_user" ("neo4jId" character varying NOT NULL, "loginDataId" uuid, CONSTRAINT "PK_0a7615c83d65e2645cce091099e" PRIMARY KEY ("neo4jId"))`);
        await queryRunner.query(`CREATE TABLE "user_login_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" jsonb NOT NULL, "state" "public"."user_login_data_state_enum" NOT NULL DEFAULT 'VALID', "expires" TIMESTAMP, "userId" uuid, "strategyInstanceId" uuid, CONSTRAINT "PK_39b8a51e24435c604e5134659dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "active_login" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL, "expires" TIMESTAMP, "isValid" boolean NOT NULL, "supportsSync" boolean NOT NULL, "nextExpectedRefreshTokenNumber" integer NOT NULL DEFAULT '-1', "data" jsonb NOT NULL, "usedStrategyInstnceId" uuid, "loginInstanceForId" uuid, "createdByClientId" uuid, CONSTRAINT "PK_295816e63c0d0d2ddfb6fa9bfea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_login_data_ims_user" ADD CONSTRAINT "FK_d5f52c4764009dba415d2d2c1b6" FOREIGN KEY ("loginDataId") REFERENCES "user_login_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_login_data" ADD CONSTRAINT "FK_7d63048c2ec0094d6e19828fee7" FOREIGN KEY ("userId") REFERENCES "login_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_login_data" ADD CONSTRAINT "FK_7e3e7be3d11ee9fa33a289cb3d4" FOREIGN KEY ("strategyInstanceId") REFERENCES "strategy_instance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "active_login" ADD CONSTRAINT "FK_403e359810fad4b6346fdf0db20" FOREIGN KEY ("usedStrategyInstnceId") REFERENCES "strategy_instance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "active_login" ADD CONSTRAINT "FK_8e31832ec1fd2564d772d87615c" FOREIGN KEY ("loginInstanceForId") REFERENCES "user_login_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "active_login" ADD CONSTRAINT "FK_e6358a5261dc7e791810e04394c" FOREIGN KEY ("createdByClientId") REFERENCES "auth_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login" DROP CONSTRAINT "FK_e6358a5261dc7e791810e04394c"`);
        await queryRunner.query(`ALTER TABLE "active_login" DROP CONSTRAINT "FK_8e31832ec1fd2564d772d87615c"`);
        await queryRunner.query(`ALTER TABLE "active_login" DROP CONSTRAINT "FK_403e359810fad4b6346fdf0db20"`);
        await queryRunner.query(`ALTER TABLE "user_login_data" DROP CONSTRAINT "FK_7e3e7be3d11ee9fa33a289cb3d4"`);
        await queryRunner.query(`ALTER TABLE "user_login_data" DROP CONSTRAINT "FK_7d63048c2ec0094d6e19828fee7"`);
        await queryRunner.query(`ALTER TABLE "user_login_data_ims_user" DROP CONSTRAINT "FK_d5f52c4764009dba415d2d2c1b6"`);
        await queryRunner.query(`DROP TABLE "active_login"`);
        await queryRunner.query(`DROP TABLE "user_login_data"`);
        await queryRunner.query(`DROP TABLE "user_login_data_ims_user"`);
        await queryRunner.query(`DROP TABLE "login_user"`);
        await queryRunner.query(`DROP TABLE "strategy_instance"`);
        await queryRunner.query(`DROP TABLE "auth_client"`);
    }

}

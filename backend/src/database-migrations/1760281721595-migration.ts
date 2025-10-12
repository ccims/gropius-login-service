import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760281721595 implements MigrationInterface {
    name = 'Migration1760281721595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "active_login_access" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL, "expires" TIMESTAMP NOT NULL, "isValid" boolean NOT NULL, "refreshTokenCounter" integer NOT NULL DEFAULT '0', "activeLoginId" uuid, CONSTRAINT "PK_a1840174e341a04b8f6961244d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "active_login_access" ADD CONSTRAINT "FK_993228f094a3b2721c2680fcc33" FOREIGN KEY ("activeLoginId") REFERENCES "active_login"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login_access" DROP CONSTRAINT "FK_993228f094a3b2721c2680fcc33"`);
        await queryRunner.query(`DROP TABLE "active_login_access"`);
    }

}

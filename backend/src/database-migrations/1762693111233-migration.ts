import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762693111233 implements MigrationInterface {
    name = "Migration1762693111233";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "active_login" SET "expires" = "created" WHERE "expires" IS NULL`);
        await queryRunner.query(`ALTER TABLE "active_login" ALTER COLUMN "expires" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login" ALTER COLUMN "expires" DROP NOT NULL`);
    }
}

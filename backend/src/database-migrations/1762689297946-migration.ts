import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762689297946 implements MigrationInterface {
    name = "Migration1762689297946";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_login_data" DROP COLUMN "expires"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_login_data" ADD "expires" TIMESTAMP`);
    }
}

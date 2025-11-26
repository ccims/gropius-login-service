import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762719228823 implements MigrationInterface {
    name = 'Migration1762719228823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login_access" ADD "authCodeFingerprint" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login_access" DROP COLUMN "authCodeFingerprint"`);
    }

}

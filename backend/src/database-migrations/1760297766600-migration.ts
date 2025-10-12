import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760297766600 implements MigrationInterface {
    name = 'Migration1760297766600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login" DROP COLUMN "nextExpectedRefreshTokenNumber"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login" ADD "nextExpectedRefreshTokenNumber" integer NOT NULL DEFAULT '-1'`);
    }

}

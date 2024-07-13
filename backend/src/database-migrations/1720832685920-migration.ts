import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720832685920 implements MigrationInterface {
    name = 'Migration1720832685920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_client" ADD "validScopes" json NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_client" DROP COLUMN "validScopes"`);
    }

}

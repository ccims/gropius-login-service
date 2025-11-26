import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760312484167 implements MigrationInterface {
    name = 'Migration1760312484167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login_access" DROP COLUMN "expires"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login_access" ADD "expires" TIMESTAMP NOT NULL`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760312596941 implements MigrationInterface {
    name = 'Migration1760312596941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login_access" DROP CONSTRAINT "FK_993228f094a3b2721c2680fcc33"`);
        await queryRunner.query(`ALTER TABLE "active_login_access" ADD CONSTRAINT "FK_993228f094a3b2721c2680fcc33" FOREIGN KEY ("activeLoginId") REFERENCES "active_login"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login_access" DROP CONSTRAINT "FK_993228f094a3b2721c2680fcc33"`);
        await queryRunner.query(`ALTER TABLE "active_login_access" ADD CONSTRAINT "FK_993228f094a3b2721c2680fcc33" FOREIGN KEY ("activeLoginId") REFERENCES "active_login"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

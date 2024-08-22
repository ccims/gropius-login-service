import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721847625737 implements MigrationInterface {
    name = "Migration1721847625737";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login" DROP CONSTRAINT "FK_e6358a5261dc7e791810e04394c"`);
        await queryRunner.query(`ALTER TABLE "active_login" DROP COLUMN "createdByClientId"`);
        await queryRunner.query(
            `ALTER TABLE "active_login" RENAME COLUMN "usedStrategyInstnceId" TO "usedStrategyInstanceId"`,
        );
        await queryRunner.query(`ALTER TABLE "strategy_instance" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "auth_client" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "auth_client" ADD "validScopes" json NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "auth_client" ALTER COLUMN "validScopes" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "auth_client" ADD COLUMN "clientCredentialFlowUserId" uuid NULL`);
        await queryRunner.query(
            `ALTER TABLE "auth_client" ADD CONSTRAINT "FK_42cc6dd6f24948b39263c943b2a" FOREIGN KEY ("clientCredentialFlowUserId") REFERENCES "login_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_login" DROP CONSTRAINT "FK_42cc6dd6f24948b39263c943b2a"`);
        await queryRunner.query(`ALTER TABLE "auth_client" DROP COLUMN "clientCredentialFlowUserId"`);
        await queryRunner.query(`ALTER TABLE "auth_client" DROP COLUMN "validScopes"`);
        await queryRunner.query(`ALTER TABLE "auth_client" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "strategy_instance" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "active_login" ADD "createdByClientId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "active_login" RENAME COLUMN "usedStrategyInstanceId" TO "usedStrategyInstnceId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "active_login" ADD CONSTRAINT "FK_e6358a5261dc7e791810e04394c" FOREIGN KEY ("createdByClientId") REFERENCES "auth_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}

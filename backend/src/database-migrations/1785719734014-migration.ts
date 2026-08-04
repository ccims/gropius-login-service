import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Enforces single use of authorization codes at the database level.
 *
 * Redemption used to check for an existing fingerprint and insert it afterwards, which two
 * concurrent requests could both pass. The unique index makes the database arbitrate instead.
 *
 * Any duplicate rows already present are the result of exactly that race, so they are removed
 * before the index is created; the oldest access per code is kept and the extra ones are
 * dropped, which revokes the refresh token chains that were issued from the replays.
 */
export class Migration1785719734014 implements MigrationInterface {
    name = "Migration1785719734014";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "active_login_access" a
            USING "active_login_access" b
            WHERE a."authCodeFingerprint" = b."authCodeFingerprint"
              AND (a."created" > b."created" OR (a."created" = b."created" AND a."id" > b."id"))
        `);
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_9c536279901d4c8b888c9bc7de" ON "active_login_access" ("authCodeFingerprint")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9c536279901d4c8b888c9bc7de"`);
    }
}

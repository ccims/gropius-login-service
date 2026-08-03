import { Injectable } from "@nestjs/common";
import { DataSource, QueryFailedError, Repository } from "typeorm";
import { ActiveLoginAccess } from "../postgres/ActiveLoginAccess.entity.js";
import { ActiveLogin } from "../postgres/ActiveLogin.entity.js";

/**
 * Whether a query failure was caused by violating a unique constraint,
 * for both supported drivers (postgres and better-sqlite3).
 */
function isUniqueViolation(error: unknown): boolean {
    const driverError = error instanceof QueryFailedError ? error.driverError : error;
    const code = (driverError as { code?: string })?.code;
    return code === "23505" || code === "SQLITE_CONSTRAINT_UNIQUE" || code === "SQLITE_CONSTRAINT";
}

@Injectable()
export class ActiveLoginAccessService extends Repository<ActiveLoginAccess> {
    constructor(private dataSource: DataSource) {
        super(ActiveLoginAccess, dataSource.createEntityManager());
    }

    /**
     * Atomically claims an authorization code for single use.
     *
     * Relies on the unique constraint over `authCodeFingerprint` to arbitrate between
     * concurrent redemptions, so that exactly one of them can win.
     *
     * @param activeLogin The login the code was issued for
     * @param authCodeFingerprint The hash of the authorization code
     * @returns The created access, or `null` if the code was already claimed
     */
    async claimAuthorizationCode(
        activeLogin: ActiveLogin,
        authCodeFingerprint: string,
    ): Promise<ActiveLoginAccess | null> {
        try {
            return await this.save(new ActiveLoginAccess(activeLogin, authCodeFingerprint, 1));
        } catch (error: unknown) {
            if (isUniqueViolation(error)) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Atomically advances the refresh token counter, guarding against parallel use
     * of the same refresh token. The counter is both read and written in one statement,
     * so only one of several concurrent redemptions can succeed.
     *
     * @param id The id of the access to rotate
     * @param expectedCounter The counter value carried by the presented refresh token
     * @returns `true` if the counter was advanced, `false` if it no longer matched
     */
    async rotateRefreshToken(id: string, expectedCounter: number): Promise<boolean> {
        const result = await this.createQueryBuilder()
            .update(ActiveLoginAccess)
            .set({ refreshTokenCounter: () => `"refreshTokenCounter" + 1` })
            .where(`id = :id AND "refreshTokenCounter" = :expectedCounter`, { id, expectedCounter })
            .execute();
        return result.affected === 1;
    }

    /**
     * Invalidates every access issued for the given login.
     *
     * Used when a replayed authorization code is detected: RFC 6819 section 5.2.1.1 requires
     * revoking the tokens that were previously issued from that code.
     *
     * @param activeLoginId The id of the login whose accesses to invalidate
     */
    async invalidateByActiveLoginId(activeLoginId: string) {
        await this.createQueryBuilder()
            .update(ActiveLoginAccess)
            .set({ isValid: false })
            .where(`"activeLoginId" = :activeLoginId`, { activeLoginId })
            .execute();
    }

    async deleteByUserId(userId: string) {
        await this.createQueryBuilder()
            .delete()
            .from(ActiveLoginAccess)
            .where(
                `
    "activeLoginId" IN (
      SELECT al.id
      FROM "active_login" al
      WHERE al."loginInstanceForId" IN (
        SELECT uld.id
        FROM "user_login_data" uld
        WHERE uld."userId" = :loginUserId
      )
    )
  `,
            )
            .setParameter("loginUserId", userId)
            .execute();
    }

    async deleteByActiveLoginId(activeLoginId: string) {
        await this.createQueryBuilder()
            .delete()
            .from(ActiveLoginAccess)
            .where(`"activeLoginId" = :activeLoginId`, { activeLoginId })
            .execute();
    }
}

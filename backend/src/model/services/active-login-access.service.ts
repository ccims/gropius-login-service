import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ActiveLoginAccess } from "../postgres/ActiveLoginAccess.entity";

@Injectable()
export class ActiveLoginAccessService extends Repository<ActiveLoginAccess> {
    constructor(private dataSource: DataSource) {
        super(ActiveLoginAccess, dataSource.createEntityManager());
    }

    async getAsserted(id: string): Promise<ActiveLoginAccess> {
        const access = await this.findOneByOrFail({ id });
        access.assert();
        return access;
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

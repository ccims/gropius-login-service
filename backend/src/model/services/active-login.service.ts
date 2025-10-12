import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ActiveLogin } from "../postgres/ActiveLogin.entity";
import { UserLoginData } from "../postgres/UserLoginData.entity";
import { LoginUser } from "../postgres/LoginUser.entity";

@Injectable()
export class ActiveLoginService extends Repository<ActiveLogin> {
    constructor(private dataSource: DataSource) {
        super(ActiveLogin, dataSource.createEntityManager());
    }

    async getValid(id: string): Promise<ActiveLogin> {
        const activeLogin = await this.findOneByOrFail({ id });
        activeLogin.assert();
        return activeLogin;
    }

    async setActiveLoginExpiration(activeLogin: ActiveLogin): Promise<ActiveLogin> {
        const loginExpiresIn = parseInt(process.env.GROPIUS_REGULAR_LOGINS_INACTIVE_EXPIRATION_TIME_MS, 10);
        if (loginExpiresIn && loginExpiresIn > 0 && !activeLogin.supportsSync) {
            activeLogin.expires = new Date(Date.now() + loginExpiresIn);
        } else {
            activeLogin.expires = null;
        }
        return this.save(activeLogin);
    }

    async findValidForLoginDataSortedByExpiration(
        loginData: UserLoginData,
        supportsSync: boolean | null,
    ): Promise<ActiveLogin[]> {
        let builder = this.createQueryBuilder("activeLogin")
            .where(`"loginInstanceForId" = :loginDataId`, {
                loginDataId: loginData.id,
            })
            .andWhere(`"isValid" = true`, {})
            .andWhere(`(("expires" is null) or ("expires" > :expires))`, {
                expires: new Date(),
            });
        if (supportsSync !== null) {
            builder = builder.andWhere(`"supportsSync" = :supportsSync`, {
                supportsSync,
            });
        }
        return builder.orderBy("expires", "DESC", "NULLS FIRST").getMany();
    }

    async deleteForUser(user: LoginUser) {
        await this.createQueryBuilder()
            .delete()
            .from(ActiveLogin)
            .where(
                `
        "loginInstanceForId" IN (
          SELECT uld.id
          FROM "user_login_data" uld
          WHERE uld."userId" = :loginUserId
        )
      `,
            )
            .setParameter("loginUserId", user.id)
            .execute();
    }
}

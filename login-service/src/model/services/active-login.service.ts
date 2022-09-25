import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ActiveLogin } from "../postgres/ActiveLogin.entity";
import { UserLoginData } from "../postgres/UserLoginData.entity";

@Injectable()
export class ActiveLoginService extends Repository<ActiveLogin> {
    constructor(private dataSource: DataSource) {
        super(ActiveLogin, dataSource.createEntityManager());
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
}

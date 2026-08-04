import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ActiveLogin } from "../postgres/ActiveLogin.entity.js";
import { UserLoginData } from "../postgres/UserLoginData.entity.js";
import { LoginUser } from "../postgres/LoginUser.entity.js";
import { ActiveLoginAccess } from "../postgres/ActiveLoginAccess.entity.js";

@Injectable()
export class ActiveLoginService extends Repository<ActiveLogin> {
    constructor(private dataSource: DataSource) {
        super(ActiveLogin, dataSource.createEntityManager());
    }

    async extendExpiration(activeLogin: ActiveLogin): Promise<ActiveLogin> {
        activeLogin.extendExpiration();
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
            .andWhere(`"isValid" = true`, {});
        if (supportsSync !== null) {
            builder = builder.andWhere(`"supportsSync" = :supportsSync`, {
                supportsSync,
            });
        }
        return builder.orderBy("expires", "DESC", "NULLS FIRST").getMany();
    }
}

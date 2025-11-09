import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ActiveLogin } from "../postgres/ActiveLogin.entity";
import { UserLoginData } from "../postgres/UserLoginData.entity";
import { LoginUser } from "../postgres/LoginUser.entity";
import { ActiveLoginAccess } from "../postgres/ActiveLoginAccess.entity";

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
            .andWhere(`"isValid" = true`, {})
            .andWhere(`"expires" > :expires`, {
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

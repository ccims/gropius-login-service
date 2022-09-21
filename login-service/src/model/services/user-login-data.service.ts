import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StrategyInstance } from "../postgres/StrategyInstance.entity";
import { LoginState, UserLoginData } from "../postgres/UserLoginData.entity";

@Injectable()
export class UserLoginDataService extends Repository<UserLoginData> {
    constructor(private dataSource: DataSource) {
        super(UserLoginData, dataSource.createEntityManager());
    }

    public findForStrategyWithDataContaining(
        strategyInstance: StrategyInstance,
        data: object,
    ): Promise<UserLoginData[]> {
        return this.createQueryBuilder("loginData")
            .where(`"strategyInstanceId" = :instanceId`, {
                instanceId: strategyInstance.id,
            })
            .andWhere(`(("expires" is null) or ("expires" >= :dateNow))`, {
                dateNow: new Date(),
            })
            .andWhere(`"data" @> :data`, { data })
            .getMany();
    }
}

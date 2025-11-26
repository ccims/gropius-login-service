import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StrategyInstance } from "../postgres/StrategyInstance.entity";
import { UserLoginData } from "../postgres/UserLoginData.entity";

@Injectable()
export class UserLoginDataService extends Repository<UserLoginData> {
    constructor(private dataSource: DataSource) {
        super(UserLoginData, dataSource.createEntityManager());
    }

    public async findForStrategyWithDataContaining(
        strategyInstance: StrategyInstance,
        data: object,
    ): Promise<UserLoginData[]> {
        return this.createQueryBuilder("loginData")
            .where(`"strategyInstanceId" = :instanceId`, {
                instanceId: strategyInstance.id,
            })
            .andWhere(`"data" @> :data`, { data })
            .getMany();
    }

    public async findForStrategyAndUsernameWithDataContaining(
        strategyInstance: StrategyInstance,
        data: object,
        username: string,
    ): Promise<UserLoginData[]> {
        return this.createQueryBuilder("loginData")
            .leftJoinAndSelect(`loginData.user`, "user")
            .where(`user.username = :username`, { username })
            .andWhere(`"strategyInstanceId" = :instanceId`, {
                instanceId: strategyInstance.id,
            })
            .andWhere(`"data" @> :data`, { data })
            .getMany();
    }
}

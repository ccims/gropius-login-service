import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StrategyInstance } from "../postgres/StrategyInstance.entity";
import { UserLoginData } from "../postgres/UserLoginData.entity";

@Injectable()
export class UserLoginDataService extends Repository<UserLoginData> {
    constructor(
        private dataSource: DataSource,
    ) {
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
            .andWhere(`(("expires" is null) or ("expires" >= :dateNow))`, {
                dateNow: new Date(),
            })
            .andWhere(`"data" @> :data`, { data })
            .getMany();
    }

    /**
     * Finds all login data entities that have a user assigned to them with the given username
     * and the id of which are contained in the given set of ids
     *
     * @param username The username thet the user of the login data is required to have
     * @param loginDataIds The set of login data ids from which the login datas to return have to be
     * @returns A lit of login datas that are from the given set and have the given username
     */
    public async findForUsernameOutOfSet(username: string, loginDataIds: string[]): Promise<UserLoginData[]> {
        return this.createQueryBuilder("loginData")
            .leftJoinAndSelect(`loginData.user`, "user")
            .where(`user.username = :username`, { username })
            .andWhereInIds(loginDataIds)
            .getMany();
    }

}

import { Injectable } from "@nestjs/common";
import { DataSource, In, Not, Repository } from "typeorm";
import { StrategyInstance } from "../postgres/StrategyInstance.entity.js";

@Injectable()
export class StrategyInstanceService extends Repository<StrategyInstance> {
    constructor(private dataSource: DataSource) {
        super(StrategyInstance, dataSource.createEntityManager());
    }

    async countAllByTypeNotIn(types: string[]): Promise<number> {
        return this.countBy({
            type: Not(In(types)),
        });
    }
}

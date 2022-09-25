import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StrategyInstance } from "../postgres/StrategyInstance.entity";

@Injectable()
export class StrategyInstanceService extends Repository<StrategyInstance> {
    constructor(private dataSource: DataSource) {
        super(StrategyInstance, dataSource.createEntityManager());
    }
}

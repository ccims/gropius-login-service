import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ActiveLoginAccess } from "../postgres/ActiveLoginAccess.entity";

@Injectable()
export class ActiveLoginAccessService extends Repository<ActiveLoginAccess> {
    constructor(private dataSource: DataSource) {
        super(ActiveLoginAccess, dataSource.createEntityManager());
    }
}

import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ActiveLoginAccess } from "../postgres/ActiveLoginAccess.entity";
import { ActiveLogin } from "../postgres/ActiveLogin.entity";

@Injectable()
export class ActiveLoginAccessService extends Repository<ActiveLoginAccess> {
    constructor(private dataSource: DataSource) {
        super(ActiveLoginAccess, dataSource.createEntityManager());
    }

    createSave(activeLogin: ActiveLogin, expires: Date) {
        const access = new ActiveLoginAccess(activeLogin, expires);
        return this.save(access);
    }

    async getAsserted(id: string): Promise<ActiveLoginAccess> {
        const access = await this.findOneByOrFail({ id });
        access.assert();
        return access;
    }
}

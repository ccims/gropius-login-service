import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserLoginDataImsUser } from "../postgres/UserLoginDataImsUser.entity";

@Injectable()
export class UserLoginDataImsUserService extends Repository<UserLoginDataImsUser> {
    constructor(private dataSource: DataSource) {
        super(UserLoginDataImsUser, dataSource.createEntityManager());
    }
}

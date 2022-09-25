import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LoginUser } from "../postgres/LoginUser.entity";

@Injectable()
export class LoginUserService extends Repository<LoginUser> {
    constructor(private dataSource: DataSource) {
        super(LoginUser, dataSource.createEntityManager());
    }
}

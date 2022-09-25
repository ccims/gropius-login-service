import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AuthClient } from "../postgres/AuthClient.entity";

@Injectable()
export class AuthClientService extends Repository<AuthClient> {
    constructor(private dataSource: DataSource) {
        super(AuthClient, dataSource.createEntityManager());
    }
}

import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AuthClient } from "../postgres/AuthClient.entity";
import { TokenScope } from "src/backend-services/token.service";

@Injectable()
export class AuthClientService extends Repository<AuthClient> {
    constructor(private dataSource: DataSource) {
        super(AuthClient, dataSource.createEntityManager());
    }

    readonly defaultAuthClients: AuthClient[] = this.createDefaultAuthClients();

    private createDefaultAuthClients(): AuthClient[] {
        const gropiusAuthClient = new AuthClient();
        gropiusAuthClient.name = "Gropius auth client";
        gropiusAuthClient.redirectUrls = [`${process.env.GROPIUS_ENDPOINT}/login`];
        gropiusAuthClient.id = "gropius-auth-client";
        gropiusAuthClient.isValid = true;
        gropiusAuthClient.validScopes = [TokenScope.BACKEND, TokenScope.LOGIN_SERVICE, TokenScope.LOGIN_SERVICE_REGISTER];

        const loginAuthClient = new AuthClient();
        loginAuthClient.name = "Login auth client";
        loginAuthClient.redirectUrls = [`${process.env.GROPIUS_LOGIN_SERVICE_ENDPOINT}/flow/update`];
        loginAuthClient.id = "login-auth-client";
        loginAuthClient.isValid = true;
        loginAuthClient.validScopes = [TokenScope.LOGIN_SERVICE_REGISTER, TokenScope.AUTH];

        return [gropiusAuthClient, loginAuthClient];
    }
    
    async findAuthClient(id: string): Promise<AuthClient | undefined> {
        const defaultClient = this.defaultAuthClients.find((client) => client.id === id);
        if (defaultClient) {
            return defaultClient;
        } else {
            return this.findOneBy({ id });
        }
    }
}

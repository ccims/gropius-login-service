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
        gropiusAuthClient.redirectUrls = [new URL("/login", process.env.GROPIUS_ENDPOINT).toString()];
        gropiusAuthClient.id = "gropius-auth-client";
        gropiusAuthClient.isValid = true;
        gropiusAuthClient.validScopes = [
            TokenScope.BACKEND,
            TokenScope.LOGIN_SERVICE,
            TokenScope.LOGIN_SERVICE_REGISTER,
        ];
        gropiusAuthClient.isInternal = true;
        gropiusAuthClient.requiresSecret = false;

        const loginAuthClient = new AuthClient();
        loginAuthClient.name = "Login auth client";
        loginAuthClient.redirectUrls = [new URL("/auth/flow/update", process.env.GROPIUS_ENDPOINT).toString()];
        loginAuthClient.id = "login-auth-client";
        loginAuthClient.isValid = true;
        loginAuthClient.validScopes = [TokenScope.LOGIN_SERVICE_REGISTER, TokenScope.AUTH, TokenScope.LOGIN_SERVICE];
        loginAuthClient.isInternal = true;
        loginAuthClient.requiresSecret = false;

        return [gropiusAuthClient, loginAuthClient];
    }

    async findAuthClient(id: string): Promise<AuthClient | undefined> {
        const defaultClient = this.defaultAuthClients.find((client) => client.id === id);
        if (defaultClient) {
            return defaultClient;
        } else {
            try {
                return await this.findOneBy({ id });
            } catch {
                return undefined;
            }
        }
    }
}

import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { AuthClient } from "src/model/postgres/AuthClient.entity";

export interface OAuthTokenServerState {
    client: AuthClient;
    activeLogin: ActiveLogin;
}
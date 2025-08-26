import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";

export enum FlowType {
    LOGIN = "LOGIN",
    REGISTER = "REG",
    REGISTER_WITH_SYNC = "REG_SYNC",
}

export interface AuthStateData {
    function: FlowType;
}

export interface AuthStateServerData {
    authState: AuthStateData;
    activeLogin?: ActiveLogin;
}

export interface AuthResult {
    dataActiveLogin: object;
    dataUserLoginData: object;
    loginData?: UserLoginData;
    mayRegister: boolean;
    noRegisterMessage?: string;
}

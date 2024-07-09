import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";

export enum AuthFunction {
    LOGIN = "LOGIN",
    REGISTER = "REG",
    REGISTER_WITH_SYNC = "REG_SYNC",
}

export interface AuthStateData {
    function: AuthFunction;
    activeLogin?: string;
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
}

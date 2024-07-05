import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";

export enum AuthFunction {
    LOGIN = "LOGIN",
    REGISTER = "REG",
    REGISTER_WITH_SYNC = "REG_SYNC",
    REGISTER_ADDITIONAL = "REG_ADD",
    REGISTER_ADDITIONAL_WITH_SYNC = "REG_ADD_SYNC",
}

export interface AuthStateData {
    function?: AuthFunction;
    activeLogin?: ActiveLogin | string;
    authErrorMessage?: string;
    authErrorType?: string;
}

export interface AuthResult {
    dataActiveLogin: object;
    dataUserLoginData: object;
    loginData?: UserLoginData;
    mayRegister: boolean;
}

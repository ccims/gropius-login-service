import { UserLoginData } from "../model/postgres/UserLoginData.entity.js";

export enum FlowType {
    LOGIN = "LOGIN",
    REGISTER = "REG",
    REGISTER_WITH_SYNC = "REG_SYNC",
}

export interface AuthResult {
    dataActiveLogin: object;
    dataUserLoginData: object;
    loginData?: UserLoginData;
    mayRegister: boolean;
    noRegisterMessage?: string;
}

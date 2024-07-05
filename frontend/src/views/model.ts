export interface StrategyInstanceBase {
    type: "credential" | "redirect";
    id: string;
    name: string;
    isLoginActive: boolean;
    isSelfRegisterActive: boolean;
    isSyncActive: boolean;
    doesImplicitRegister: boolean;
}

export interface CredentialStrategyInstance extends StrategyInstanceBase {
    type: "credential";
    loginFields: LoginStrategyVariable[];
    registerFields: LoginStrategyVariable[];
}

export interface RedirectStrategyInstance extends StrategyInstanceBase {
    type: "redirect";
}

export type StrategyInstance = CredentialStrategyInstance | RedirectStrategyInstance;

export interface GroupedStrategyInstances {
    credential: CredentialStrategyInstance[];
    redirect: RedirectStrategyInstance[];
}

export interface LoginStrategyVariable {
    name: string;
    displayName?: string;
    type: "boolean" | "number" | "object" | "string" | "password";
    nullable?: boolean;
}

export interface LoginStrategy {
    typeName: string;
    canLoginRegister: boolean;
    canSync: boolean;
    needsRedirectFlow: boolean;
    allowsImplicitSignup: boolean;
    acceptsVariables: { [name: string]: LoginStrategyVariable };
}

export interface LoginStrategyInstance {
    id: string;
    name: string;
    type: string;
    isLoginActive: boolean;
    isSelfRegisterActive: boolean;
    isSyncActive: boolean;
    doesImplicitRegister: boolean;
}

export interface OAuthRespose {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export enum TokenScope {
    LOGIN_SERVICE = "login",
    LOGIN_SERVICE_REGISTER = "login-register",
    BACKEND = "backend",
    REFRESH_TOKEN = "token",
    NONE = "none"
}

export enum UserDataSuggestionStatus {
    ALREADY_REGISTERED = "already-registered",
    USERNAME_TAKEN = "username-taken",
    NO_DATA = "no-data",
    OK = "ok"
}

export interface UserDataSuggestionResponse {
    status: UserDataSuggestionStatus;
    username?: string;
    displayName?: string;
    email?: string;
}

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

export interface LoginStrategyUpdateAction {
    name: string;
    displayName: string;
    variables: LoginStrategyVariable[];
}

export interface LoginStrategy {
    typeName: string;
    canLoginRegister: boolean;
    canSync: boolean;
    needsRedirectFlow: boolean;
    allowsImplicitSignup: boolean;
    acceptsVariables: LoginStrategyVariable[];
    updateActions: LoginStrategyUpdateAction[];
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

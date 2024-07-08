import { AuthClient } from "src/model/postgres/AuthClient.entity";

export interface OAuthAuthorizeRequest {
    state?: string;
    redirect: string;
    clientId: string;
    scope: string[];
    codeChallenge?: string;
    codeChallengeMethod?: string;
    responseType: "code";
}

export interface OAuthAuthorizeServerState {
    request: OAuthAuthorizeRequest;
    client: AuthClient;
}
import { AuthClient } from "src/model/postgres/AuthClient.entity";

export interface OAuthAuthorizeRequestData {
    state?: string;
    redirect: string;
    clientId: string;
    scope: string[];
    codeChallenge?: string;
    codeChallengeMethod?: string;
    responseType: "code";
}

export interface OAuthAuthorizeServerStateData {
    request: OAuthAuthorizeRequestData;
    client: AuthClient;
}
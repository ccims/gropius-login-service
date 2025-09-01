import { TokenScope } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";

export interface OAuthAuthorizeRequest {
    state?: string;
    redirect: string;
    clientId: string;
    scope: TokenScope[];
    codeChallenge: string;
    codeChallengeMethod: string;
    responseType: "code";
}

// TODO: get rid of this
export interface OAuthAuthorizeServerState {
    request: OAuthAuthorizeRequest;
    client: AuthClient;
    isRegisterAdditional: boolean;
}

import { TokenScope } from "src/backend-services/token.service";

export interface OAuthAuthorizeRequest {
    state?: string;
    redirect: string;
    clientId: string;
    scope: TokenScope[];
    codeChallenge: string;
    codeChallengeMethod: string;
    responseType: "code";
}

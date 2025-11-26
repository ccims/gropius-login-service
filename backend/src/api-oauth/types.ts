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

export class OauthTokenResponse {
    access_token: string;
    token_type: "bearer";
    expires_in: number;
    refresh_token?: string;
    scope: string;
}

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
    /**
     * The access token issued by the authorization server
     * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     */
    access_token: string;
    
    /**
     * The type of token issued
     * @example "bearer"
     */
    token_type: "bearer";
    
    /**
     * The lifetime in seconds of the access token
     * @example 3600
     */
    expires_in: number;
    
    /**
     * The refresh token, which can be used to obtain new access tokens
     * @example "tGzv3JOkF0XG5Qx2TlKWIA"
     */
    refresh_token?: string;
    
    /**
     * The scope of the access token
     * @example "read write"
     */
    scope: string;
}

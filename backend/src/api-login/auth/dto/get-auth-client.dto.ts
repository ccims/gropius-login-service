/**
 * Response of GET for one single auth client.
 * Same as {@link AuthClient} extended by `censoredClientSecrets`
 */
export class GetAuthClientResponse {
    /**
     * The unique ID of this client
     *
     * @example 12345678-90ab-cdef-fedc-ab0987654321
     */
    id: string;

    /**
     * The list of valid enpoints to redirect the user back to after authentication has finished.
     *
     * The actual url to use is given in the authorize request and must be included in this list.
     * If none is given, the first one from this list will be used
     *
     * @example ["https://example.com/oauth/callback?query=value"]
     */
    redirectUrls: string[];

    /**
     * If this is `false` the client is not valid and no authorization, token, ... requests from it should be answered.
     *
     * @example true
     */
    isValid: boolean;

    /**
     * If `true` requesting a token as this client
     * requires the use of a client secret accoring to the oauth specification.
     *
     * If `false` client secrets can be present and given but are not required
     * @example false
     */
    requiresSecret: boolean;

    /**
     * A list of a representation of all client secrets.
     *
     * Includes the fingerprint of the has of the secret as identifying field
     * and a censored version (5 char prefix) of the original secret text for easier idenfication by users
     */
    censoredClientSecrets: CensoredClientSecret[];

    /**
     * The Gropius UUID of the user to use as subject for the client credential flow.
     */
    clientCredentialFlowUser?: string;
}

/**
 * A censored client secret
 */
export class CensoredClientSecret {
    /**
     * The 5 letter prefix of the original client secret text plus stars for identification of the secret by the user
     * @example "1a2b3**********"
     */
    censored: string;

    /**
     * The fingerprint of the hash of the client secret.
     * Used as identifier to delete the secret.
     * @example "0123456789abcdef"
     */
    fingerprint: string;
}

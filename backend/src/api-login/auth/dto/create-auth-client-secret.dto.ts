/**
 * Response when creating a new client secret for an auth client.
 * Contains the original secret text
 */
export class CreateAuthClientSecretResponse {
    /**
     * The generated client secret text.
     * This is the data that must be given for request that require authentication
     *
     * @example "a01b23c45d67e89f"
     */
    secretText: string;

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

import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { TokenScope } from "src/backend-services/token.service";

/**
 * Input to `POST /login/client` and PUT /login/client/:id`
 * Contains data to create or modify a auth client
 */
export class UpdateAuthClientInput {
    /**
     * The name to set for the auth client.
     *
     * If given, must be non empty
     */
    name?: string;

    /**
     * A list of url strings containing at least one url.
     * These are the URLs the oauth autorize endpoint will redirect back to
     *
     * Defaults to `[]` on create
     * @example ["https://example.com/oauth/callback?query=value"]
     */
    redirectUrls?: string[];

    /**
     * If given, sets the validity flag of the auth client.
     *
     * Defaults to `true` on create
     * @example true
     */
    isValid?: boolean;

    /**
     * If given, setns the need for the client to authenticate using a secret
     *
     * Defaults to `true` on create
     * @example false
     */
    requiresSecret?: boolean;

    /**
     * The list of scopes that this client is allowed to request.
     *
     * Defaults to `[]` on create
     * @example ["backend"]
     */
    validScopes?: TokenScope[];

    /**
     * The user to use as subject for the client credential flow.
     */
    clientCredentialFlowUser?: string;

    /**
     * Checks a given `CreateOrUpdateAuthClientInput` for validity.
     *
     * Valid, if:
     * - `name` is not given or a non empty string matching /^[a-zA-Z0-9+/\-_= ]+$/g
     * - `redirectUrls` is not given or an array of at least one url
     * - `isValid` is not given or a boolean
     * - `requiresSecret` is not given or a boolean
     * - `validScopes` is not given or an array of strings containing only `TokenScope.BACKEND` and `TokenScope.LOGIN_SERVICE`
     * - `clientCredentialFlowUser` is not given or a string (does not check that the user exists)
     * @param input The input instance to check
     * @returns The given instance unchanged
     */
    static check(input: UpdateAuthClientInput): UpdateAuthClientInput {
        if (typeof input.name != "string" || input.name.trim().length == 0) {
            throw new HttpException("If given, name must be a non empty string", HttpStatus.BAD_REQUEST);
        }
        if (input.redirectUrls != undefined) {
            if (!Array.isArray(input.redirectUrls)) {
                throw new HttpException(
                    "If redirect URLs are given, they must be an array of valid url strings",
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
        for (const url of input.redirectUrls) {
            if (typeof url !== "string") {
                throw new HttpException("All given redirect urls must be valid url strings", HttpStatus.BAD_REQUEST);
            }
            try {
                new URL(url);
            } catch (err) {
                throw new HttpException("Invalid redirect url: " + err.message ?? err, HttpStatus.BAD_REQUEST);
            }
        }
        if (input.isValid != undefined && typeof input.isValid !== "boolean") {
            throw new HttpException("If isValid is given, it must be a valid boolean", HttpStatus.BAD_REQUEST);
        }
        if (input.requiresSecret != undefined && typeof input.requiresSecret !== "boolean") {
            throw new HttpException("If requiresSecret is given, it must be a valid boolean", HttpStatus.BAD_REQUEST);
        }
        if (input.validScopes != undefined) {
            if (!Array.isArray(input.validScopes)) {
                throw new HttpException("validScopes must be an array of strings", HttpStatus.BAD_REQUEST);
            }
        }
        for (const scope of input.validScopes) {
            if (scope !== TokenScope.BACKEND) {
                throw new HttpException(
                    `Only ${TokenScope.BACKEND} is a valid scopes`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
        if (input.clientCredentialFlowUser != undefined) {
            if (typeof input.clientCredentialFlowUser !== "string") {
                throw new HttpException("clientCredentialFlowUser must be a string", HttpStatus.BAD_REQUEST);
            }
        }
        return input;
    }
}

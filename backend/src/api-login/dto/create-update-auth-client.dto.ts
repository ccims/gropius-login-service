import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Input to `POST /login/client` and PUT /login/client/:id`
 * Contains data to create or modify a auth client
 */
export class CreateOrUpdateAuthClientInput {
    /**
     * The name to set for the auth client.
     *
     * If given, must be non empty and match /^[a-zA-Z0-9+/\-_= ]+$/g
     */
    name?: string | null;

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
     * Checks a given `CreateOrUpdateAuthClientInput` for validity.
     *
     * Valid, if:
     * - `name` is not given or a non empty string matching /^[a-zA-Z0-9+/\-_= ]+$/g
     * - `redirectUrls` is not given or an array of at least one url
     * - `isValid` is not given or a boolean
     * - `requiresSecret` is not given or a boolean
     * @param input The input instance to check
     * @returns The given instance unchanged
     */
    static check(input: CreateOrUpdateAuthClientInput): CreateOrUpdateAuthClientInput {
        if (input.name != undefined) {
            if (typeof input.name != "string" || input.name.trim().length == 0) {
                throw new HttpException("If given, name must be a non empty string", HttpStatus.BAD_REQUEST);
            }
            if (input.name.match(/[^a-zA-Z0-9+/\-_= ]/g)) {
                throw new HttpException("If given, name must match /^[a-zA-Z0-9+/\\-_= ]+$/g", HttpStatus.BAD_REQUEST);
            }
        }
        if (input.redirectUrls != undefined) {
            if (!(input.redirectUrls instanceof Array) || input.redirectUrls.length == 0) {
                throw new HttpException(
                    "If redirect URLs are given, they must be an array of valid url strings " +
                        "containing at least one entry",
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
        return input;
    }
}

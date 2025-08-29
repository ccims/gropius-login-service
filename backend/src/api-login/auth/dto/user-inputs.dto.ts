import { HttpException, HttpStatus } from "@nestjs/common";
import { RegistrationTokenInput } from "./link-user.dto";

// TODO: drop this

/**
 * Base input type containing all needed fields to create a new user
 */
export class BaseUserInput {
    /**
     * The username to set for the new user.
     * Must be given and cannot be empty
     *
     * @example "testUser"
     */
    username: string;

    /**
     * The name to display in the UI for the new user.
     * Must be given and can't be empty
     *
     * @example "Test User"
     */
    displayName: string;

    /**
     * The email of the new user.
     * Can be ommitted, but if given can't be empty.
     *
     * @example "test-user@example.com"
     */
    email?: string;

    /**
     * Checks for a valid {@link BaseUserInput}
     *
     * Needed:
     * - `username` is a required, non empty string
     * - `displayName` is a required, non empty string
     * - `email` is, if given, a non empty string
     *
     * @param input The instance to check
     * @returns The argument unchanged
     * @throws {@link HttpException} BAD_REQUEST if invalid
     */
    static check(input: BaseUserInput): BaseUserInput {
        if (!input.username || input.username.trim().length == 0) {
            throw new HttpException("Username must be given and can't be empty", HttpStatus.BAD_REQUEST);
        }
        if (!input.displayName || input.displayName.trim().length == 0) {
            throw new HttpException("Display name must be given and can't be empty", HttpStatus.BAD_REQUEST);
        }
        if (input.email?.length === 0) {
            input.email = undefined;
        }
        if (input.email != undefined) {
            if (input.email.trim().length == 0) {
                throw new HttpException("If email is given it can't be blank", HttpStatus.BAD_REQUEST);
            }
        }
        return input;
    }
}

/**
 * Input object for creating a new user as admin.
 * Expects an additional, optional isAdmin parameter
 */
export class CreateUserAsAdminInput extends BaseUserInput {
    /**
     * Set whether the newly created user will be an administrator.
     *
     * If not given, defaults to false
     *
     * @example false
     */
    isAdmin?: boolean;

    /**
     * Checks for a valid {@link CreateUserAsAdminInput}
     *
     * Needed:
     * - Valid {@link BaseUserInput}
     * - `isAdmin` is, if given, a valid boolean
     *
     * @param input The instance to check
     * @returns The argument unchanged
     * @throws {@link HttpException} BAD_REQUEST if invalid
     */
    static check(input: CreateUserAsAdminInput): CreateUserAsAdminInput {
        BaseUserInput.check(input);
        if (input.isAdmin != undefined) {
            if (typeof input.isAdmin != "boolean") {
                throw new HttpException("If isAdmin is given it must be a valid boolean", HttpStatus.BAD_REQUEST);
            }
        }
        return input;
    }
}

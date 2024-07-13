import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Input type for self-linking
 * Only expects the register_token
 */
export class RegistrationTokenInput {
    /**
     * The register token issued during as result of the oauth registration flow.
     * Scope of the token must contain "login-register".
     *
     * Must be given.
     *
     * @example "registration.token.jwt"
     */
    register_token: string;

    /**
     * Checks that the given object contains a register_token string that in not empty
     *
     * @param input The instance to check
     * @returns The argument unchanged
     * @throws {@link HttpException} BAD_REQUEST if invalid
     */
    static check(input: RegistrationTokenInput): RegistrationTokenInput {
        if (typeof input.register_token != "string" || input.register_token.trim().length == 0) {
            throw new HttpException("The register_token must be given and can't be empty", HttpStatus.BAD_REQUEST);
        }
        return input;
    }
}

/**
 * Input type for an admin linking an authentication to a different user
 */
export class AdminLinkUserInput extends RegistrationTokenInput {
    /**
     * The uuid string of ae existing `LoginUser` with which to link the authentication behind the registration token
     *
     * @example 12345678-90ab-cdef-fedc-ab0987654321
     */
    userIdToLink: string;

    /**
     * Checks that the given object contains a non empty string for the user id.
     * Aso checks that it is a valid {@link RegistrationTokenInput}
     *
     * @param input The instance to check
     * @returns The argument unchanged
     * @throws {@link HttpException} BAD_REQUEST if invalid
     */
    static check(input: AdminLinkUserInput): AdminLinkUserInput {
        RegistrationTokenInput.check(input);
        if (!input.userIdToLink || input.userIdToLink.trim().length == 0) {
            throw new HttpException(
                "User id for user to link the new login to must be given and can't be empty.",
                HttpStatus.BAD_REQUEST,
            );
        }
        return input;
    }
}

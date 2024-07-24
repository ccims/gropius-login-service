import { RegistrationTokenInput } from "src/api-login/auth/dto/link-user.dto";
import { BaseUserInput } from "src/api-login/auth/dto/user-inputs.dto";

/**
 * Input type for user self registration.
 * Expects an additional register_token
 */
export class SelfRegisterUserInput extends BaseUserInput {
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
     * The state of the oauth flow
     */
    state: string;

    /**
     * Checks for a valid {@link SelfRegisterUserInput}
     *
     * Needed:
     * - Valid {@link BaseUserInput}
     * - Valid {@link RegistrationTokenInput}
     *
     * @param input The instance to check
     * @returns The argument unchanged
     * @throws {@link HttpException} BAD_REQUEST if invalid
     */
    static check(input: SelfRegisterUserInput): SelfRegisterUserInput {
        BaseUserInput.check(input);
        RegistrationTokenInput.check(input);
        return input;
    }
}
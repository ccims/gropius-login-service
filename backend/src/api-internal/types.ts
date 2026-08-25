export enum AuthFunctionInput {
    LOGIN = "login",
    REGISTER = "register",
    REGISTER_WITH_SYNC = "register-sync",
}

/**
 * Input for starting a passkey registration
 */
export class PasskeyRegistrationOptionsInput {
    /**
     * The username the user asked for.
     *
     * Only used as the name the authenticator displays for the new passkey and as the
     * suggestion on the registration form, the actual username is chosen when registering.
     *
     * @example "testUser"
     */
    username?: string;
}

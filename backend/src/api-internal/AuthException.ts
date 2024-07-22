export class AuthException extends Error {
    constructor(
        readonly authErrorMessage: string,
        readonly strategyInstanceId: string,
    ) {
        super(authErrorMessage);
    }
}

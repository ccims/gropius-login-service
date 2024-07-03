import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Input data type for modifying an existing user
 */
export class UpdateStrategyInstanceInput {
    /**
     * The name for the strategy instance to create.
     * Can be left out.
     *
     * If given, must be a non empty string matching `/^[a-zA-Z0-9+/\-_= ]+$/`
     *
     * @exmple "userpass-local"
     */
    name?: string;

    /**
     * The data required by the strategy to configure the instance.
     *
     * For example: the client id and secret for an oauth strategy
     *
     * @example {"clientId": "1234", "clientSecret": "secret"}
     */
    instanceConfig: object;

    /**
     * Set wehter, login should be active on the new strategy
     * Can only be true, if {@link Strategy.canLoginRegister} (default value)
     *
     * @example true
     */
    isLoginActive?: boolean;

    /**
     * Set whether, user self registration should be active on the new strategy
     * Can only be true, if {@link Strategy.canLoginRegister} (default value)
     *
     * @example true
     */
    isSelfRegisterActive?: boolean;

    /**
     * Set whether, providing sync tokens should be active on the new strategy
     * Can only be true, if {@link Strategy.canSync} (default value)
     *
     * @example false
     */
    isSyncActive?: boolean;

    /**
     * Set whether, the instance will implicitly register on a unknown login.
     * Can only be true, if {@link Strategy.allowsImplicitSignup} (default value)
     *
     * @example false
     */
    doesImplicitRegister?: boolean;

    /**
     * Checks, input is a valid {@link UpdateStrategyInstanceInput}
     *
     * Needs:
     * - If name is given, must be non empty and match `/^[a-zA-Z0-9+/\-_= ]+$/`
     * - If instanceConfig is given it must be an object
     * - If any of the flags is given it must be a valid boolean
     *
     * @param input The original input data to be checked
     * @returns If successful, the input data
     */
    static check(input: UpdateStrategyInstanceInput): UpdateStrategyInstanceInput {
        if (input.name != undefined) {
            if (typeof input.name != "string" || input.name.trim().length == 0) {
                throw new HttpException("If name is given it must be a non empty string", HttpStatus.BAD_REQUEST);
            }
        }
        if (input.name != undefined) {
            if (input.name.match(/[^a-zA-Z0-9+/\-_= ]/g)) {
                throw new HttpException(
                    "Name of strategy instance may only contain alphanumeric characters, -, _, +, /, = and space",
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
        if (input.instanceConfig != undefined && typeof input.instanceConfig != "object") {
            throw new HttpException("If instance config is given, it must be given as object", HttpStatus.BAD_REQUEST);
        }
        if (input.isLoginActive != undefined && typeof input.isLoginActive != "boolean") {
            throw new HttpException("If isLoginActive is given it must be a valid boolean", HttpStatus.BAD_REQUEST);
        }
        if (input.isSelfRegisterActive != undefined && typeof input.isSelfRegisterActive != "boolean") {
            throw new HttpException(
                "If isSelfRegisterActive is given it must be a valid boolean",
                HttpStatus.BAD_REQUEST,
            );
        }
        if (input.isSyncActive != undefined && typeof input.isSyncActive != "boolean") {
            throw new HttpException("If isSyncActive is given it must be a valid boolean", HttpStatus.BAD_REQUEST);
        }
        if (input.doesImplicitRegister != undefined && typeof input.doesImplicitRegister != "boolean") {
            throw new HttpException(
                "If doesImplicitRegister is given it must be a valid boolean",
                HttpStatus.BAD_REQUEST,
            );
        }
        return input;
    }
}

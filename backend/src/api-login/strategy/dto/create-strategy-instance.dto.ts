import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateStrategyInstanceInput } from "./update-strategy-instance.dto";

/**
 * Input data type for the create query of a strategy instance
 *
 * Needs to contain all data for a strategy instance (except the type if that is given in the url)
 */
export class CreateStrategyInstanceInput extends UpdateStrategyInstanceInput {
    /**
     * The name for the strategy instance to create.
     * Can be left out.
     *
     * If given, must be a non empty string
     *
     * @exmple "userpass-local"
     */
    name: string;
    /**
     * The type name of the strategy this is an instance of.
     *
     * Optional, if given as URL parameter; otherwise required
     *
     * @example "userpass"
     */
    type?: string;

    /**
     * Checks whether the input is a valid `CreateStrategyInstanceInput`
     *
     * Needed:
     * - Must be valid {@link UpdateStrategyInstanceInput}
     * - Must have a non empty name
     * - If type is given, must be non empty string
     *
     * @param input The input object to check
     * @returns If succeessful, the original input
     */
    static check(input: CreateStrategyInstanceInput): CreateStrategyInstanceInput {
        if (input.name == undefined) {
            throw new HttpException(
                "Name of stragety must be specified on creation and can't be empty",
                HttpStatus.BAD_REQUEST,
            );
        }
        if (input.type != undefined && input.type.trim().length == 0) {
            throw new HttpException(
                "Type of stragety must be specified on creation and can't be empty",
                HttpStatus.BAD_REQUEST,
            );
        }
        UpdateStrategyInstanceInput.check(input);
        return input;
    }
}

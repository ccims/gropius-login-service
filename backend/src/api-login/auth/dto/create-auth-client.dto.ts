import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateAuthClientInput } from "./update-auth-client.dto";

export class CreateAuthClientInput extends UpdateAuthClientInput {
    /**
     * The name to set for the auth client.
     *
     * Must be non empty
     */
    name: string;

    /**
     * Checks whether the input is a valid `CreateAuthClientInput`
     * 
     * Needed:
     * - Must be valid {@link UpdateAuthClientInput}
     * - Must have a non empty name
     * 
     * @param input The input object to check
     * @returns The original input object
     */
    static check(input: CreateAuthClientInput): CreateAuthClientInput {
        if (input.name == undefined) {
            throw new HttpException(
                "Name of auth client must be specified on creation and can't be empty",
                HttpStatus.BAD_REQUEST,
            );
        }
        UpdateAuthClientInput.check(input);
        return input;
    }
}

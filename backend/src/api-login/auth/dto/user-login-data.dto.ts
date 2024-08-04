import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { LoginState } from "src/model/postgres/UserLoginData.entity";

export class UserLoginDataResponse {
    /**
     * The unique ID of this login data
     *
     * @example 12345678-90ab-cdef-fedc-ab0987654321
     */
    id: string;

    /**
     * The state this authentication is in.
     *
     * Rules:
     * - Only UserLoginData in state {@link LoginState.VALID} may be used for login and retrieving an access token.
     * - Only UserLoginData in state {@link LoginState.WAITING_FOR_REGISTER} may be used for registration or linking.
     * - UserLoginData in state {@link LoginState.BLOCKED} cannot be used for anything
     *
     * @example "VALID"
     */
    state: LoginState;

    /**
     * If not `null`, this authentication should be considered *invalid* on any date+time AFTER this.
     * This is to ensure created UserLoginData, that are not used for registration
     * or linking in time, are not kept forever.
     *
     * If `null`, the authentication should not expire by date.
     */
    expires: Date | null;

    /**
     * The strategy instance this authentication uses.
     *
     * For example a UserLoginData containing a password would reference a strategy instance of type userpass
     */
    strategyInstance: StrategyInstance;

    /**
     * A description of the authentication
     */
    description: string;
}

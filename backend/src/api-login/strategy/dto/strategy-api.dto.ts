import { Schema } from "jtd";
import { StrategyVariable } from "src/strategies/Strategy";

/**
 * Representation of a strategy in the API
 */
export class GetStrategyResponse {
    /**
     * The unique (type) name of the strategy
     *
     * @example "userpass"
     */
    typeName: string;

    /**
     * `true` iff instances of this strategy have the theoretical capability of logging in users
     *
     * @example true
     */
    canLoginRegister: boolean;

    /**
     * `true` iff instances of this strategy have the theoretical capability
     * of providing api tokens to the a sync service
     *
     * @example false
     */
    canSync: boolean;

    /**
     * `true` if to authenticate using this strategy, a redirect of the users browser is required
     *
     * `false` if sending credentials to the token endpoint is enough
     *
     * @example false
     */
    needsRedirectFlow: boolean;

    /**
     * `true` iff this strategy allows instances to use implicit signup
     * to register users automatically if they don't have an account but tried to login
     *
     * @example false
     */
    allowsImplicitSignup: boolean;

    /**
     * The specification of the data expected in the post body if not using redirect
     * and sending the credentials directly to the token endpoint
     */
    acceptsVariables: Record<string, StrategyVariable>;

    /**
     * The schema of the instance configuration
     */
    instanceConfigSchema: Record<string, Schema>;
}

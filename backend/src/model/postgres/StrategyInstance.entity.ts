import { ApiHideProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Strategy } from "../../strategies/Strategy";

/**
 * Entity representing an instance of a strategy including its config.
 *
 * For example one GiHub instance as instance of strategy type GitHub.
 *
 * One StrategyInstance equates to 0-n IMSs of the same template in the backend
 * which all reference the same ims instance.
 */
@Entity()
export class StrategyInstance {
    /**
     * @param type The strategy this is an instance of
     */
    constructor(type: string) {
        this.type = type;
    }

    /**
     * The unique ID of this strategy instance
     *
     * @example 12345678-90ab-cdef-fedc-ab0987654321
     */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * An optional human readable name for the strategy.
     *
     * Can be displayes in a UI etc.
     * but is not necesarrily unique.
     *
     * Can only contain [A-Za-z0-9_\-/+= ]*
     *
     * @example "Github-Enterprise-Example"
     */
    @Column({ nullable: true })
    name: string | null;

    /**
     * The configuration of the instance needed to perform authentication with it.
     *
     * The data this contains is up to the strategy this is an instance of.
     * For example client id + client secret; urls etc.
     */
    @Column("jsonb")
    @ApiHideProperty()
    instanceConfig: object;

    /**
     * The unique string name of the strategy this is an instance of
     *
     * The strategy of an instance is set on initialization and **cannot** be changed
     *
     * @example "userpass"
     */
    @Column()
    readonly type: string;

    /**
     * If `true`, this strategy instance allows login of registered users to retrieve an access token.
     * Additionally the strategy must have {@link Strategy.canLoginRegister} set to `true`
     *
     * If `false`, users are not allowed to login using this instance.
     *
     * @example true
     */
    @Column()
    isLoginActive: boolean;

    /**
     * If `true` users can create an account themselves with the registration token they obtained from this instance.
     * This only affects registration, not linking an additional account.
     * Additionally the strategy must have {@link Strategy.canLoginRegister} set to `true`
     *
     * If `false` accounts cannot be created without being admin.
     *
     * @example true
     */
    @Column()
    isSelfRegisterActive: boolean;

    /**
     * If `true`, and {@link Strategy.canSync} is `true`,
     * the sync service can retrieve access tokens for ims users from this strategy instnce.
     *
     * If `false`, no tokens will be handed out for the instance
     *
     * @example false
     */
    @Column()
    isSyncActive: boolean;

    /**
     * If `true`, a user automatically gets a registration token,
     * if they tried to login and an account was not found but the user provided credentials
     * (i.e. sucessfully authenticated with the 3rd party).
     * Needs {@link Strategy.allowsImplicitSignup} to be `true`.
     *
     * If `false`, login fails if no known user was found.
     *
     * @example false
     */
    @Column()
    doesImplicitRegister: boolean;

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            isLoginActive: this.isLoginActive,
            isSelfRegisterActive: this.isSelfRegisterActive,
            isSyncActive: this.isSyncActive,
            doesImplicitRegister: this.doesImplicitRegister,
        };
    }
}

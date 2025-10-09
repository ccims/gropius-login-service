import { ApiHideProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ActiveLogin } from "./ActiveLogin.entity";
import { LoginUser } from "./LoginUser.entity";
import { StrategyInstance } from "./StrategyInstance.entity";
import { UserLoginDataImsUser } from "./UserLoginDataImsUser.entity";

/**
 * The states a UserLoginData can be in
 */
export enum LoginState {
    /**
     * The user authenticated using a strategy but has no account yet or no account has been linked yet.
     * The login data will be saved for the specified registration time
     * to give the user time to call the registration or link api using the register token
     */
    WAITING_FOR_REGISTER = "WAITING_FOR_REGISTER",

    /**
     * The UserLoginData represents a valid way the user can authenticate.
     * It can be used to login/sync (depending on strategy instance config).
     */
    VALID = "VALID",

    /**
     * The login of the user with this login data has been blocked by an administrator
     */
    BLOCKED = "BLOCKED",
}

/**
 * Entity for representing the authenticatoin of a user using onme strategy instance
 *
 * It contains the data needed to identify a user if they tries to log in (e.g. username/id on 3rd party service).
 * For example password for username/password auth or the username for GitHub auth
 */
@Entity()
export class UserLoginData {
    /**
     * The unique ID of this login data
     *
     * @example 12345678-90ab-cdef-fedc-ab0987654321
     */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * The user that is represented by this authentication.
     * Will be set once a user has been crated or linked for the new authentication.
     * Null before that.
     *
     * If this authentication is used to login, this is the user which should be logged in.
     */
    @ManyToOne(() => LoginUser, (user) => user.loginData, { nullable: true })
    @ApiHideProperty()
    user: Promise<LoginUser | null>;

    /**
     * The strategy instance this authentication uses.
     *
     * For example a UserLoginData containing a password would reference a strategy instance of type userpass
     */
    @ManyToOne(() => StrategyInstance)
    @JoinColumn({ name: "strategyInstanceId" })
    @ApiHideProperty()
    strategyInstance: Promise<StrategyInstance>;

    /**
     * Data which needs to be stored for the user for every strategy he uses
     * (e.g. username on the 3rd party platform, password for userpass).
     *
     * The exact data and structure stored depends on the strategy and their usage.
     * It will be set on initial registration of a authentication and not changed afterwards.
     */
    @Column("jsonb")
    @ApiHideProperty()
    data: any;

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
    @Column({
        type: "enum",
        enum: LoginState,
        default: LoginState.VALID,
    })
    state: LoginState;

    /**
     * If not `null`, this authentication should be considered *invalid* on any date+time AFTER this.
     * This is to ensure created UserLoginData, that are not used for registration
     * or linking in time, are not kept forever.
     *
     * If `null`, the authentication should not expire by date.
     */
    @Column({ nullable: true, default: null })
    expires: Date | null;

    /**
     * All IMSUser instances in the backend that are represented by this authentication.
     *
     * These are all users in an IMS that are represented by the strategy instance
     * of this that match the needed data for this user.
     * If a request for an access token for any of these IMS users comes in,
     * the best token from all logins of this authenticaiton will be returned.
     *
     * IMSUsers are added when:
     * - a sync service sends the information, that a IMSUser was created
     * - a user registeres (or logs in) using this authentication and new matching IMSUsers are found
     * - a user registeres (or logs in) using this authentication and
     *     an IMS is found on which no IMSUser for this authentication is found.
     */
    @OneToMany(() => UserLoginDataImsUser, (imsUser) => imsUser.loginData)
    @ApiHideProperty()
    imsUsers: Promise<UserLoginDataImsUser[]>;

    /**
     * A list of all login events that used this authentication.
     *
     * Every time the user logs in or registers a new login instance will be saved.
     */
    @OneToMany(() => ActiveLogin, (login) => login.loginInstanceFor)
    @ApiHideProperty()
    loginsUsingThis: Promise<ActiveLogin[]>;

    get isExpired() {
        return this.expires != null && this.expires <= new Date();
    }

    toJSON() {
        return { id: this.id, state: this.state, expires: this.expires };
    }
}

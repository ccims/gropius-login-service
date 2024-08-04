import { ApiHideProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StrategyInstance } from "./StrategyInstance.entity";
import { UserLoginData } from "./UserLoginData.entity";

/**
 * Entity representing a single login event by one user using a specific strategy.
 *
 * This object contains the data specific to this login event (e.g. tokens, ...).
 * It also saves the login time and other meta data needed to keep track of the login.
 *
 * It can be invalidated by flag or expiration date
 */
@Entity()
export class ActiveLogin {
    static LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIVED = -1;

    constructor(usedStrategyInstance: StrategyInstance, expires?: Date) {
        this.usedStrategyInstance = Promise.resolve(usedStrategyInstance);
        this.created = new Date();
        this.expires = expires || null;
        this.isValid = true;
        this.nextExpectedRefreshTokenNumber = ActiveLogin.LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIVED;
    }

    /**
     * The unique ID of this active login
     *
     * @example 12345678-90ab-cdef-fedc-ab0987654321
     */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * The date+time at which the user logged in, creating this event.
     * Can be the time the authentication request was submitted or the time the access token was retrieved
     */
    @Column()
    created: Date;

    /**
     * If not `null`, this login should be considered *invalid* on any date+time AFTER this.
     * This is to ensure logout and time restrict registration etc.
     *
     * If `null`, the login should not expire by date.
     */
    @Column({ nullable: true })
    expires: Date | null;

    /**
     * Whether this login is valid to be used.
     *
     * If `false` it should be considered *invalid* (just like expired) and no new tokens issued for it.
     * @example true
     */
    @Column()
    isValid: boolean;

    /**
     * Whether this login events data can be used for sync by the sync service.
     * Should be `true` for logins created with REGISTER_SYNC function, `false` otherwise
     *
     * If `true`, the data (e.g. the token) will be passed to tke sync service
     * upon request for a IMSUser to be used to write onto that IMS in the users name
     *
     * If `false`, this login will be skipped in te search for a token.
     *
     * @example false
     */
    @Column()
    supportsSync: boolean;

    /**
     * The numeric identifier of the last refresh token given out (the next one expected).
     *
     * **ONLY** the token with this id should be accepted as refresh token for this login event.
     * If a **valid** token with an **older** id is used, this login event should be made invalid,
     * as it is a reuse of the refresh token, which likely means it has been abused.
     *
     * For a new instance this starts at LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIVED=-1 and
     * gets incremented once the first refresh token is created.
     *
     * @example 0
     */
    @Column({
        default: -1,
    })
    @ApiHideProperty()
    nextExpectedRefreshTokenNumber: number;

    /**
     * Data which needs to be stored on a per-login basis (e.g. issued tokens from auth provider)
     */
    @Column("jsonb")
    @ApiHideProperty()
    data: object = {};

    /**
     * The strategy instance that this login event used
     *
     * May not be null, must be set on creation.
     */
    @ManyToOne(() => StrategyInstance)
    @ApiHideProperty()
    usedStrategyInstance: Promise<StrategyInstance>;

    /**
     * The `loginData` that represents the authentication of a user using one strategy.
     * This login event is one event instance of this authentication.
     *
     * Should be set as soon as possible and should not be changed afterwards.
     */
    @ManyToOne(() => UserLoginData, (loginData) => loginData.loginsUsingThis, {
        nullable: true,
    })
    @JoinColumn({ name: "loginInstanceForId" })
    @ApiHideProperty()
    loginInstanceFor: Promise<UserLoginData | null>;

    toJSON() {
        return {
            id: this.id,
            created: this.created,
            expores: this.expires,
            isValid: this.isValid,
            supportsSync: this.supportsSync,
        };
    }
}

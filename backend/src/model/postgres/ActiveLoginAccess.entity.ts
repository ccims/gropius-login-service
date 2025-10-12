import { ApiHideProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ActiveLogin } from "./ActiveLogin.entity";

// TODO: create database migration

/**
 * Entity representing the access to an ActiveLogin.
 * Essentially, one ActiveLogin has many ActiveLoginAccesses, each representing an OAuth client.
 */
@Entity()
export class ActiveLoginAccess {
    static LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIEVED = -1;

    constructor(activeLogin: ActiveLogin, expires: Date) {
        this.activeLogin = Promise.resolve(activeLogin);
        this.created = new Date();
        this.expires = expires;
        this.isValid = true;
        this.nextExpectedRefreshTokenNumber = ActiveLoginAccess.LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIEVED;
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    created: Date;

    @Column()
    expires: Date;

    @Column()
    isValid: boolean;

    /**
     * The numeric identifier of the last refresh token given out (the next one expected).
     *
     * **ONLY** the token with this id should be accepted as refresh token for this login event.
     * If a **valid** token with an **older** id is used, this login event should be made invalid,
     * as it is a reuse of the refresh token, which likely means it has been abused.
     *
     * For a new instance this starts at LOGGED_IN_BUT_TOKEN_NOT_YET_RETRIEVED=-1 and
     * gets incremented once the first refresh token is created.
     *
     * @example 0
     */
    @Column({
        default: 0,
    })
    @ApiHideProperty()
    nextExpectedRefreshTokenNumber: number;

    @ManyToOne(() => ActiveLogin)
    @ApiHideProperty()
    activeLogin: Promise<ActiveLogin>;

    get isExpired() {
        return this.expires != null && this.expires <= new Date();
    }
}

import { ApiHideProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ActiveLogin } from "./ActiveLogin.entity";

/**
 * Entity representing the access of an OAuth client to an ActiveLogin.
 * It is used to keep track of used auth code and issued refresh tokens per OAuth client per ActiveLogin.
 * Hence, one ActiveLogin has many ActiveLoginAccesses.
 */
@Entity()
export class ActiveLoginAccess {
    constructor(activeLogin: ActiveLogin, authCodeFingerprint: string, counter: number) {
        this.activeLogin = activeLogin;
        this.created = new Date();
        this.isValid = true;
        this.authCodeFingerprint = authCodeFingerprint;
        this.refreshTokenCounter = counter;
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    created: Date;

    @Column()
    isValid: boolean;

    /**
     * Track used auth code to prevent reuse.
     */
    @Column()
    authCodeFingerprint: string;

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
    refreshTokenCounter: number;

    @ManyToOne(() => ActiveLogin, undefined, {
        eager: true,
        nullable: false,
        onDelete: "CASCADE",
    })
    @ApiHideProperty()
    activeLogin: ActiveLogin;

    assert() {
        if (!this.isValid) throw new Error("Access is not valid");
    }
}

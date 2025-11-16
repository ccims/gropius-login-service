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
     * Counter to track issued refresh tokens.
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

import { ApiHideProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserLoginData } from "./UserLoginData.entity";

/**
 * A user of the Gropius system.
 * This 1:1 equates the GropiusUser entity in the backend.
 *
 * A user can have many ways of authenticating (login data)
 */
@Entity()
export class LoginUser {
    /**
     * The unique ID of this login user
     *
     * @example 12345678-90ab-cdef-fedc-ab0987654321
     */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * The id of this user in the neo4j database.
     *
     * If null after initialization, there was an error.
     * Must be unique as relation to GropiusUser is 1:1.
     */
    @Column({ unique: true, nullable: true })
    neo4jId: string | null;

    /**
     * The plain text username of the user.
     * Must be kept in sync with username in backend.
     *
     * Currently has no use outside the userpass strategy
     */
    @Column({ unique: true })
    username: string;

    /**
     * All ways of a user to authenticate.
     *
     * This also includes ways that do not allow login but only sync
     */
    @OneToMany(() => UserLoginData, (loginData) => loginData.user)
    @ApiHideProperty()
    loginData: Promise<UserLoginData[]>;

    /**
     * All tokens (INCLUDING access tokens) issued to this user **before** this date are no longer valid.
     *
     * Used to 'emergency'-Revoke tokens
     */
    @Column()
    revokeTokensBefore: Date;

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            revokeTokensBefore: this.revokeTokensBefore,
        };
    }
}

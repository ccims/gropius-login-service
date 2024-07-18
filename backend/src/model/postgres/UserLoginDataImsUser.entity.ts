import { ApiHideProperty } from "@nestjs/swagger";
import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { UserLoginData } from "./UserLoginData.entity";

/**
 * Entity representing an IMSUser in the backend.
 *
 * All IMSUsers for which an authentication is known are stored in association with that authentication
 *
 * @see {@link UserLoginData.imsUsers}
 */
@Entity()
export class UserLoginDataImsUser {
    /**
     * The id of the IMSUser in the backend.
     * Also used as identifying column as an entity of this type
     * will only be created once the id is known and ids are uniqe.
     *
     * @example 12345678-90ab-cdef-fedc-ab0987654321
     */
    @PrimaryColumn()
    @ApiHideProperty()
    neo4jId: string;

    /**
     * The authentication that represents this IMSUser
     */
    @ManyToOne(() => UserLoginData, (loginData) => loginData.imsUsers)
    @ApiHideProperty()
    loginData: Promise<UserLoginData>;

    toJSON() {
        return {};
    }
}

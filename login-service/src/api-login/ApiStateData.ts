import { LoginUser } from "src/model/postgres/LoginUser.entity";

/**
 * Interface specifying the structure of the data in the response object,
 * passed from middleware to middleware to controller within the login api.
 *
 * It is not returned to the requestor
 */
export interface ApiStateData {
    loggedInUser: LoginUser;
}

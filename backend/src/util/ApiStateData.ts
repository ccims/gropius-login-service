import { LoginUser } from "../model/postgres/LoginUser.entity.js";

/**
 * Interface specifying the structure of the data in the response object,
 * passed from middleware to middleware to controller within the login api.
 *
 * It is not returned to the requestor
 */
export interface ApiStateData {
    loggedInUser: LoginUser;
}

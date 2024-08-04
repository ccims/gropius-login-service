import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { GraphqlService } from "src/model/graphql/graphql.service";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { UserLoginDataImsUser } from "src/model/postgres/UserLoginDataImsUser.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { LoginUserService } from "src/model/services/login-user.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";

export interface CreateUserInput {
    username: string;
    displayName: string;
    email?: string;
}

@Injectable()
export class BackendUserService {
    private readonly logger = new Logger(BackendUserService.name);
    constructor(
        private readonly graphqlService: GraphqlService,
        private readonly loginUserService: LoginUserService,
        private readonly userService: LoginUserService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly userLoginDataService: UserLoginDataService,
    ) {}

    /**
     * Checks if the user may access admin actions.
     *
     * Calls the backend API to retrieve the information.
     *
     * Potential optimation if performance is a problem: Cache admin state for one login session (activeLogin)
     *
     * @param user The user for which to check admin permissions
     * @returns `true` if the user is allowed to access admin actions, `false` if not
     */
    async checkIsUserAdmin(user: LoginUser): Promise<boolean> {
        if (!user.neo4jId) {
            throw new Error("User without neo4jId: " + user.id);
        }
        const loadedUser = await this.graphqlService.sdk.checkUserIsAdmin({ id: user.neo4jId });
        if (!loadedUser?.node) {
            throw new Error(`Backend did not know neo4jid ${user.neo4jId} that it previously returned`);
        }
        if (loadedUser?.node?.__typename == "GropiusUser") {
            if (loadedUser.node.isAdmin === true) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks for the existance of a GropiusUser with the neo4jid specified in the given LoginUser
     *
     * Meant to check database consistency. For a properly created LoginUser this should always return true
     *
     * @param user The LoginUser to check in the backend
     * @returns `true` iff the LoginUser has a valid associated GropiusUser in the backend
     */
    async checkUserExists(user: LoginUser): Promise<boolean> {
        if (!user.neo4jId) {
            throw new Error("User without neo4jId: " + user.id);
        }
        const loadedUser = await this.graphqlService.sdk.getBasicGropiusUserData({ id: user.neo4jId });
        if (loadedUser?.node?.__typename == "GropiusUser") {
            return true;
        }
        return false;
    }

    /**
     * Fetches all backend ids of all existing GropiusUsers in the backend
     */
    async getAllGropiusUsersInBackend(): Promise<string[]> {
        const ids = (await this.graphqlService.sdk.getAllGrpiusUsers())?.gropiusUserIds;
        if (!ids) {
            throw new Error("Could not fetch gropius user ids from backend");
        }
        return ids;
    }

    async createNewUser(input: CreateUserInput, isAdmin: boolean): Promise<LoginUser> {
        let loginUser = new LoginUser();
        loginUser.username = input.username;
        loginUser.revokeTokensBefore = new Date();
        loginUser = await this.loginUserService.save(loginUser);
        try {
            const backendUser = await this.graphqlService.sdk.createNewUser({
                input: {
                    username: input.username,
                    displayName: input.displayName,
                    email: input.email,
                    isAdmin,
                },
            });
            if (!backendUser.createGropiusUser.gropiusUser.id) {
                throw new Error("No Id returned on mutation; Assuming error");
            }
            loginUser.neo4jId = backendUser.createGropiusUser.gropiusUser.id;
            loginUser = await this.loginUserService.save(loginUser);
        } catch (err) {
            this.logger.error("Error during user creation in backend. Rolling back created user");
            await this.loginUserService.remove(loginUser);
            throw err;
        }
        return loginUser;
    }

    /**
     * Fetches the user date (username, ...) of the user fron the backend and creates a LoginUser for it
     *
     * Meant to be used in case of database inconsistency as usually both users should be created simultaneously
     *
     * @param neo4jId The bakcend neo4j id of the GropiusUser to create a LoginUser for
     * @returns The created LoginUser instance
     */
    async createLoginUserForExistingBackendUser(neo4jId: string): Promise<LoginUser> {
        try {
            const backendUser = await this.graphqlService.sdk.getBasicGropiusUserData({ id: neo4jId });
            if (backendUser?.node?.__typename !== "GropiusUser") {
                throw new Error(
                    `When asking for GropiusUser ${neo4jId}, a ${backendUser?.node?.__typename} was returned`,
                );
            }
            let loginUser = new LoginUser();
            loginUser.username = backendUser.node.username;
            loginUser.revokeTokensBefore = new Date();
            loginUser.neo4jId = backendUser.node.id;
            loginUser = await this.loginUserService.save(loginUser);
            return loginUser;
        } catch (err) {
            throw err;
        }
    }

    async linkOneImsUserToGropiusUser(loginUser: LoginUser, imsUser: UserLoginDataImsUser) {
        if (!loginUser.neo4jId) {
            throw new Error("User without neo4jId: " + loginUser.id);
        }
        const gropiusUserId = loginUser.neo4jId;
        if (!gropiusUserId) {
            throw new Error("Login user has no Gropius user associated");
        }
        const linkResult = await this.graphqlService.sdk.setImsUserLink({
            gropiusUserId,
            imsUserId: imsUser.neo4jId,
        });
    }

    async linkAllImsUsersToGropiusUser(loginUser: LoginUser, loginData: UserLoginData) {
        if (!loginUser.neo4jId) {
            throw new Error("User without neo4jId: " + loginUser.id);
        }
        const gropiusUserId = loginUser.neo4jId;
        if (!gropiusUserId) {
            throw new Error("Login user has no Gropius user associated");
        }
        const imsUsers = await loginData.imsUsers;
        const linkResults = await Promise.allSettled(
            imsUsers.map((user) =>
                this.graphqlService.sdk.setImsUserLink({
                    gropiusUserId,
                    imsUserId: user.neo4jId,
                }),
            ),
        );
        const failedLinks = linkResults.filter(
            (result) =>
                result.status == "rejected" || (result.status == "fulfilled" && !result.value.updateIMSUser.imsUser.id),
        );
        if (failedLinks.length > 0) {
            this.logger.warn("Failures during linking ims user and Gropius user:", failedLinks);
        }
    }

    /**
     * Helper function performing tha actual linking of login data with user.
     *
     * If the given login data already has a user set, the user must match the given one,
     * else a INTERNAL_SERVER_ERROR is raised.
     *
     * The expiration of the loginData will be removed.
     * The expiration of the activeLogin will be set to the default login expiration time,
     * except if the strategy supports sync, then the active login will never expire.
     * The state of the loginData will be updated to VALID if it was WAITING_FOR_REGISER before
     *
     * @param userToLinkTo The user account to link the new authentication to
     * @param loginData The new authentication to link to the user
     * @param activeLogin The active login that was created during the authentication flow
     * @returns The saved and updated user and login data after linking
     */
    public async linkAccountToUser(
        userToLinkTo: LoginUser,
        loginData: UserLoginData,
        activeLogin: ActiveLogin,
    ): Promise<{ loggedInUser: LoginUser; loginData: UserLoginData }> {
        if (!userToLinkTo) {
            throw new HttpException(
                "Not logged in to any account. Linking not possible. Try logging in or registering",
                HttpStatus.BAD_REQUEST,
            );
        }
        if (loginData.state == LoginState.WAITING_FOR_REGISTER) {
            loginData.state = LoginState.VALID;
        }
        const currentLoginDataUser = await loginData.user;
        if (currentLoginDataUser == null) {
            loginData.user = Promise.resolve(userToLinkTo);
        } else {
            if (currentLoginDataUser.id !== userToLinkTo.id) {
                // Shoud not be reachable as this is already checked in token check
                throw new HttpException(
                    "Login data user did not match logged in user",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
        loginData.expires = null;
        loginData = await this.userLoginDataService.save(loginData);

        await this.activeLoginService.setActiveLoginExpiration(activeLogin);

        userToLinkTo = await this.userService.findOneBy({
            id: userToLinkTo.id,
        });

        await this.linkAllImsUsersToGropiusUser(userToLinkTo, loginData);
        return { loggedInUser: userToLinkTo, loginData };
    }
}

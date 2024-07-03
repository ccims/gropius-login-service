import { Injectable, Logger } from "@nestjs/common";
import { GraphqlService } from "src/model/graphql/graphql.service";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { UserLoginDataImsUser } from "src/model/postgres/UserLoginDataImsUser.entity";
import { LoginUserService } from "src/model/services/login-user.service";

export interface CreateUserInput {
    username: string;
    displayName: string;
    email?: string;
}

@Injectable()
export class BackendUserService {
    private readonly logger = new Logger(BackendUserService.name);
    constructor(private readonly graphqlService: GraphqlService, private readonly loginUserService: LoginUserService) {}

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
        ); //.map((result) => (result.status == "fulfilled" ? result.value : result.reason));
        this.logger.warn("Failures during linking ims user and Gropius user:", failedLinks);
    }
}

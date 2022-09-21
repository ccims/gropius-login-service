import { Injectable } from "@nestjs/common";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { UserLoginData, LoginState } from "src/model/postgres/UserLoginData.entity";
import { LoginUserService } from "src/model/services/login-user.service";
import { StrategiesService } from "src/model/services/strategies.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { Strategy } from "src/strategies/Strategy";

/**
 * Service for creating a new default user according to the environment config
 */
@Injectable()
export class CreateDefaultUserService {
    constructor(
        private readonly strategiesService: StrategiesService,
        private readonly strategyInstanceService: StrategyInstanceService,
        private readonly loginUserService: LoginUserService,
        private readonly userLoginDataService: UserLoginDataService,
        private readonly backendUserService: BackendUserService,
    ) {}

    /**
     * Tries to find a login strategy instance with the given name.
     * If none exists, tries to find one with the instance name field being interpreted as strategy type
     *
     * @param strategyInstanceName The name of the strategy instance
     * or if that doesnt exist the strategy type to be retrieved
     * @returns The strategy and strategy instance for the instance with the given name
     */
    private async findStrategyAndInstance(
        strategyInstanceName: string,
    ): Promise<{ strategyInstance: StrategyInstance; strategy: Strategy }> {
        let strategyInstance = await this.strategyInstanceService.findOneBy({
            name: strategyInstanceName,
            isLoginActive: true,
        });
        if (!strategyInstance) {
            strategyInstance = await this.strategyInstanceService.findOneBy({
                type: strategyInstanceName,
                isLoginActive: true,
            });
        }
        if (!strategyInstance) {
            throw new Error(`No strategy instance with either name or type ${strategyInstanceName} and enabled login`);
        }

        const strategy = this.strategiesService.getStrategyByName(strategyInstance.type);
        if (!strategy) {
            throw new Error(`No strategy of type ${strategyInstance.type} even though instance of it was found`);
        }
        return { strategyInstance, strategy };
    }

    /**
     * Executes the authentication using the strategy withthe provided name.
     * If loginData is found it is returned.
     * If none is found a new instance will be created and returned (UNSAVED!)
     *
     * @param strategyInstanceName The name of the strategy instance to use for authentication
     * @param postBody The body data to be "posted" to the strategy for authentication (e.g. password)
     * @returns Login data either retrieved by the auth or newly created
     */
    private async getLoginDataThroughAuth(strategyInstanceName: string, postBody: any): Promise<UserLoginData> {
        const { strategy, strategyInstance } = await this.findStrategyAndInstance(strategyInstanceName);

        const result = await strategy.performAuth(
            strategyInstance,
            {},
            {
                body: postBody,
            },
            {},
        );

        let loginData: UserLoginData | undefined = result.result.loginData;

        if (loginData) {
            console.log(`Login data matching the provided data already exists. Skipping creation`);
        } else {
            if (!result.result.mayRegister) {
                throw new Error(`Auth result disallowed registering`);
            }
            loginData = new UserLoginData();
            loginData.data = result.result.dataUserLoginData;
            loginData.strategyInstance = Promise.resolve(strategyInstance);
        }

        return loginData;
    }

    /**
     * Takes an optional user that the given loginData is to be linked to.
     *
     * Possible cases:
     * - LoginData already has a user that differs from the given one => Error will be thrown
     * - LoginData has same user as given one => nothing is done
     * - LoginData has no user, user is given => LoginData is linked to given user
     * - LoginData has no user, no user is given => New user created and loginData linked to it
     *
     * @param user The existing user to link to the login data or undefined/null if one should be created
     * @param loginData The login data that should be linked to the user given
     * @param username The username for a user to create
     * @param displayName The display name for a user to create
     * @returns the given loginData object, with link added
     */
    private async createAndOrLinkUserAndLoginData(
        user: LoginUser | undefined | null,
        loginData: UserLoginData,
        username: string,
        displayName: string,
    ): Promise<UserLoginData> {
        const userFromLoginData = await loginData.user;
        if (user) {
            if (!userFromLoginData) {
                loginData.user = Promise.resolve(user);
            } else if (userFromLoginData.id == user.id) {
                console.log(`Found matching pair of login data and user. Nothing to do`);
            } else {
                throw new Error("No user for username found but login data has already different user assigned");
            }
        } else {
            if (userFromLoginData) {
                throw new Error("Matching login data already has a different user assigned than found");
            } else {
                user = await this.backendUserService.createNewUser({ username, displayName }, true);
                loginData.user = Promise.resolve(user);
            }
        }
        return loginData;
    }

    /**
     * Create a new default user if environment config is set that way.
     *
     * A user will be created, if at least
     * GROPIUS_DEFAULT_USER_USERNAME, GROPIUS_DEFAULT_USER_DISPLAYNAME and GROPIUS_DEFAULT_USER_STRATEGY_INSTANCE_NAME
     * are set.
     *
     * The system will be searched for matchin users in username and login data
     */
    async createDefaultUser() {
        const username = process.env.GROPIUS_DEFAULT_USER_USERNAME;
        const displayName = process.env.GROPIUS_DEFAULT_USER_DISPLAYNAME;
        let postData: string | object = process.env.GROPIUS_DEFAULT_USER_POST_DATA;
        const strategyInstanceName = process.env.GROPIUS_DEFAULT_USER_STRATEGY_INSTANCE_NAME;

        if (!username || !displayName || !strategyInstanceName) {
            return;
        }
        if (typeof postData == "string") {
            postData = JSON.parse(postData);
        }
        if (!postData || typeof postData != "object") {
            throw new Error(`Specified post data is not an object`);
        }

        const user = await this.loginUserService.findOneBy({ username });
        if (user) {
            if (!(await this.backendUserService.checkIsUserAdmin(user))) {
                throw new Error(`Found user with username ${username} but withoud admin permissions.`);
            }
            console.log(`User with username ${username} already exists. Skipping creation`);
        }

        const loginData = await this.getLoginDataThroughAuth(strategyInstanceName, {
            ...postData,
            username,
        });

        loginData.expires = null;
        loginData.state = LoginState.VALID;

        await this.createAndOrLinkUserAndLoginData(user, loginData, username, displayName);

        await this.userLoginDataService.save(loginData);
    }
}

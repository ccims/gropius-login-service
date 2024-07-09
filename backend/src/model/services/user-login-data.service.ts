import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StrategyInstance } from "../postgres/StrategyInstance.entity";
import { LoginState, UserLoginData } from "../postgres/UserLoginData.entity";
import { LoginUserService } from "./login-user.service";
import { ActiveLoginService } from "./active-login.service";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { LoginUser } from "../postgres/LoginUser.entity";
import { ActiveLogin } from "../postgres/ActiveLogin.entity";

@Injectable()
export class UserLoginDataService extends Repository<UserLoginData> {
    constructor(
        private dataSource: DataSource,
        private readonly userService: LoginUserService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly backendUserSerivce: BackendUserService,
    ) {
        super(UserLoginData, dataSource.createEntityManager());
    }

    public async findForStrategyWithDataContaining(
        strategyInstance: StrategyInstance,
        data: object,
    ): Promise<UserLoginData[]> {
        return this.createQueryBuilder("loginData")
            .where(`"strategyInstanceId" = :instanceId`, {
                instanceId: strategyInstance.id,
            })
            .andWhere(`(("expires" is null) or ("expires" >= :dateNow))`, {
                dateNow: new Date(),
            })
            .andWhere(`"data" @> :data`, { data })
            .getMany();
    }

    /**
     * Finds all login data entities that have a user assigned to them with the given username
     * and the id of which are contained in the given set of ids
     *
     * @param username The username thet the user of the login data is required to have
     * @param loginDataIds The set of login data ids from which the login datas to return have to be
     * @returns A lit of login datas that are from the given set and have the given username
     */
    public async findForUsernameOutOfSet(username: string, loginDataIds: string[]): Promise<UserLoginData[]> {
        return this.createQueryBuilder("loginData")
            .leftJoinAndSelect(`loginData.user`, "user")
            .where(`user.username = :username`, { username })
            .andWhereInIds(loginDataIds)
            .getMany();
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
        loginData = await this.save(loginData);

        await this.activeLoginService.setActiveLoginExpiration(activeLogin);

        userToLinkTo = await this.userService.findOneBy({
            id: userToLinkTo.id,
        });

        await this.backendUserSerivce.linkAllImsUsersToGropiusUser(userToLinkTo, loginData);
        return { loggedInUser: userToLinkTo, loginData };
    }
}

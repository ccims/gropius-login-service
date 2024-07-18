import { Injectable, Logger } from "@nestjs/common";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { ImsUserFindingService } from "src/backend-services/ims-user-finding.service";
import { LoginState } from "src/model/postgres/UserLoginData.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { LoginUserService } from "src/model/services/login-user.service";
import { StrategiesService } from "src/model/services/strategies.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { UserLoginDataImsUserService } from "src/model/services/user-login-data-ims-user";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { IsNull, Not } from "typeorm";

@Injectable()
export class CheckDatabaseConsistencyService {
    private readonly logger = new Logger(CheckDatabaseConsistencyService.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly loginUserService: LoginUserService,
        private readonly strategyInstanceService: StrategyInstanceService,
        private readonly strategyService: StrategiesService,
        private readonly userLoginDataService: UserLoginDataService,
        private readonly userLoginDataImsUserService: UserLoginDataImsUserService,
        private readonly backendUserService: BackendUserService,
        private readonly imsUserFindingService: ImsUserFindingService,
    ) {}

    /**
     * Checks all active logins in the database for consistency.
     *
     * Currently no inconsistent state is possible.
     *
     * A warning is produced, if any active logins without login data are found.
     * This is allowed, but should not happen in normal operation
     */
    private async checkActiveLogin(fixBroken: boolean): Promise<string | undefined> {
        const numActiveLoginWithoutLoginData = await this.activeLoginService.countBy({
            loginInstanceFor: IsNull(),
        });
        if (numActiveLoginWithoutLoginData > 0) {
            this.logger.warn(`Found ${numActiveLoginWithoutLoginData} active logins without login data.
            This is not problematic but might indicate data loss somewhere.`);
        }

        return undefined;
    }

    /**
     * Checks all login users in the database and the backend for consistency.
     *
     * A login user in the database is inconsistent if
     * - It has no neo4j id (NOT FIXABLE)
     * - It doesn't exist in the backend (NOT FIXABLE)
     */
    private async checkLoginUser(fixBroken: boolean): Promise<string | undefined> {
        const numLoginUserWithoutNeo4jId = await this.loginUserService.countBy({
            neo4jId: IsNull(),
        });
        if (numLoginUserWithoutNeo4jId > 0) {
            return `Found ${numLoginUserWithoutNeo4jId} users without a backend/neo4j ID.
            This means they were not created successfully`;
        }

        const nonExistentUser = (
            await Promise.all(
                (
                    await this.loginUserService.find({ select: ["neo4jId"] })
                ).map(async (u) => ((await this.backendUserService.checkUserExists(u)) ? null : u)),
            )
        ).filter((u) => u !== null);
        if (nonExistentUser.length > 0) {
            return `Found ${nonExistentUser.length} users that don't exist in the backend.
            User ids: ${nonExistentUser.map((u) => u.id).join(", ")}`;
        }

        const allBackendGropiusUsers = await this.backendUserService.getAllGropiusUsersInBackend();
        const loginUserIds = (
            await this.loginUserService.find({
                select: ["neo4jId"],
            })
        ).map((u) => u.neo4jId);
        const backendUsersNotInDb = allBackendGropiusUsers.filter((id) => !loginUserIds.includes(id));
        if (backendUsersNotInDb.length > 0) {
            const err = `Found ${backendUsersNotInDb.length} users in the backend that aren't in the db.
            Backend Ids: ${backendUsersNotInDb.join(", ")}`;
            if (fixBroken) {
                this.logger.warn(`Fixing: ${err}`);
                for (const user of backendUsersNotInDb) {
                    await this.backendUserService.createLoginUserForExistingBackendUser(user);
                }
            } else {
                return err;
            }
        }

        return undefined;
    }

    /**
     * Checks if all strategy instances are consistent
     *
     * A strategy instance is considered inconsistent when:
     * - It has a type of a strategy that is unknown (NOT FIXABLE)
     */
    private async checkStrategyInstance(fixBroken: boolean): Promise<string | undefined> {
        const numNotValidType = await this.strategyInstanceService.countAllByTypeNotIn(
            this.strategyService.getAllStrategies().map((s) => s.typeName),
        );
        if (numNotValidType > 0) {
            return `Found ${numNotValidType} strategies that have a type of an unknown strategy.`;
        }

        return undefined;
    }

    /**
     * Checks if all UserLoginData elements in the database are consistent
     *
     * A UserLoginData is considered inconsistent when:
     * - It is set to state VALID but has no user assigned (NOT FIXABLE)
     * - It is set to state WAITING_FOR_REGISTER but has a user assigned (NOT FIXABLE)
     */
    private async checkUserLoginData(fixBroken: boolean): Promise<string | undefined> {
        const numValidWithoutUser = await this.userLoginDataService.countBy({
            state: LoginState.VALID,
            user: IsNull(),
        });
        if (numValidWithoutUser > 0) {
            return `Found ${numValidWithoutUser} UserLoginData elements that have no LoginUser but are valid`;
        }

        const numRegisterWithUser = await this.userLoginDataService.countBy({
            state: LoginState.WAITING_FOR_REGISTER,
            user: Not(IsNull()),
        });
        if (numRegisterWithUser > 0) {
            return `Found ${numRegisterWithUser} UserLoginData elements with LoginUser that are in registration`;
        }
    }

    /**
     * Checks if all UserLoginDataImsUser elements in the database are consistent
     *
     * A UserLoginDataImsUser is considered inconsistent when:
     * - The IMSUser referenced by its neo4j ID doesn't exist in the backend (NOT FIXABLE)
     */
    private async checkUserLoginDataImsUser(fixBroken: boolean): Promise<string | undefined> {
        const nonExistentImsUser = (
            await Promise.all(
                (
                    await this.userLoginDataImsUserService.find({ select: ["neo4jId"] })
                ).map(async (u) => ((await this.imsUserFindingService.checkImsUserExists(u)) ? null : u)),
            )
        ).filter((u) => u !== null);
        if (nonExistentImsUser.length > 0) {
            return `Found ${
                nonExistentImsUser.length
            } UserLoginDataImsUser elements for which the IMS user doesn't exist.
            IMSUser ids: ${nonExistentImsUser.map((u) => u.neo4jId).join(", ")}`;
        }
    }

    private async testDatabaseForConsistency(fixBroken: boolean): Promise<string | undefined> {
        const activeLogin = await this.checkActiveLogin(fixBroken);
        if (activeLogin !== undefined) {
            return activeLogin;
        }

        const loginUser = await this.checkLoginUser(fixBroken);
        if (loginUser !== undefined) {
            return loginUser;
        }

        const strategyInstance = await this.checkStrategyInstance(fixBroken);
        if (strategyInstance !== undefined) {
            return strategyInstance;
        }

        const loginData = await this.checkUserLoginData(fixBroken);
        if (loginData !== undefined) {
            return loginData;
        }

        const imsUser = await this.checkUserLoginDataImsUser(fixBroken);
        if (imsUser !== undefined) {
            return imsUser;
        }

        this.logger.log("Database consistent with itself and the backend");
    }

    public async checkDatabaseConsistency(): Promise<boolean> {
        return (await this.testDatabaseForConsistency(false)) === undefined;
    }

    public async ensureDatabaseConsistency(
        fixBrokenConsistency = process.env.GROPIUS_DEFAULT_CHECK_DATABASE_CONSISTENT == "fix",
    ): Promise<void> {
        const result = await this.testDatabaseForConsistency(fixBrokenConsistency);
        if (result !== undefined) {
            throw new Error(result);
        }
    }

    public async runDatabaseCheck(): Promise<void> {
        switch (process.env.GROPIUS_DEFAULT_CHECK_DATABASE_CONSISTENT) {
            case "none":
                break;
            case "fix":
                await this.ensureDatabaseConsistency(true);
            case "check":
            default:
                await this.ensureDatabaseConsistency(false);
        }
    }
}

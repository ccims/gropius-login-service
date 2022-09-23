import { Injectable, Logger } from "@nestjs/common";
import { GraphqlService } from "src/model/graphql/graphql.service";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { UserLoginDataImsUser } from "src/model/postgres/UserLoginDataImsUser.entity";
import { UserLoginDataImsUserService } from "src/model/services/user-login-data-ims-user";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { StrategiesService } from "src/model/services/strategies.service";
import { Strategy } from "src/strategies/Strategy";
import { jsonFieldArrayToObject, objectToJsonFieldArray } from "./JSONField";
import { BackendUserService } from "./backend-user.service";
import { deepEqual } from "fast-equals";

@Injectable()
export class ImsUserFindingService {
    private readonly logger = new Logger(ImsUserFindingService.name);
    constructor(
        private readonly graphqlService: GraphqlService,
        private readonly strategiesService: StrategiesService,
        private readonly loginDataService: UserLoginDataService,
        private readonly imsUserService: UserLoginDataImsUserService,
        private readonly backendUserService: BackendUserService,
    ) {}

    /**
     * Checks if the values of the specified fields on the templatedValues match the values of those fields on the node
     * Deletes the keys that were compared from `templatedValue`
     *
     * Can be used directly on e.g. the ims as node to check the description
     * or on the templated fields of the ims to check those
     *
     * @param node The node object containing all values of keys to potentially check
     * @param requiredTemplatedValues The values that the node object must match to pass.
     * All fields to check will be deleted from this object
     * @param fieldsToCheck The names of the fields that should be checked for equivalence
     * on the node object directly instead of on its templated fields.
     * If not given, all keys of `templatedFields` will be matched
     * @returns `true` iff all specified keys that the templatedValues had a value fore matched, `false` else
     */
    private checkFieldsDirectly(node: object, requiredTemplatedValues: object, fieldsToCheck?: string[]): boolean {
        const fields = fieldsToCheck ? fieldsToCheck : Object.keys(requiredTemplatedValues);
        for (const key of fields) {
            if (requiredTemplatedValues[key]) {
                if (!node[key]) {
                    return false;
                }
                if (requiredTemplatedValues[key] != node[key]) {
                    return false;
                }
                if (deepEqual(requiredTemplatedValues[key], node[key])) {
                    return false;
                }
                delete requiredTemplatedValues[key];
            }
        }
        return true;
    }

    private async checkIfInstanceMatches(
        strategy: Strategy,
        instance: StrategyInstance,
        ims: object,
        imsTemplatedValues: { [key: string]: any },
    ): Promise<boolean> {
        const requiredTemplatedValues = await strategy.getImsTemplatedValuesForStrategyInstance(instance);
        if (requiredTemplatedValues == null) {
            this.logger.error(`Syncing strategy instance ${instance.id} did not provide required templated values`);
            return false;
        }
        if (!this.checkFieldsDirectly(ims, requiredTemplatedValues, ["id", "name", "description"])) {
            return false;
        }
        if (!this.checkFieldsDirectly(imsTemplatedValues, requiredTemplatedValues)) {
            return false;
        }
        return true;
    }

    private async getMatchingInstance(
        ims: object,
        imsTemplatedValues: { [key: string]: any },
    ): Promise<{ instance: StrategyInstance; strategy: Strategy }> {
        const allSyncStrategies = this.strategiesService.getAllStrategies().filter((s) => s.canSync);

        const matchingInstances: {
            instance: StrategyInstance;
            strategy: Strategy;
        }[] = [];

        await Promise.all(
            allSyncStrategies.map(async (strategy) => {
                const allInstances = await strategy.getAllInstances();
                await Promise.all(
                    allInstances.map(async (instance) => {
                        if (this.checkIfInstanceMatches(strategy, instance, ims, imsTemplatedValues)) {
                            matchingInstances.push({ instance, strategy });
                        }
                    }),
                );
            }),
        );

        if (matchingInstances.length != 1) {
            throw new Error(
                `Not exactly one (${matchingInstances.length}) instance matched the ims of the given ims user`,
            );
        }
        return matchingInstances[0];
    }

    /**
     * Extracts a subset of fields from the given object,
     * deletes them from the given object and returns them as seperate object
     *
     * @param data The object to extract fields from. This will be modified using `delete`
     * @param fields The names of the fields to remove from the object
     * @returns An object with the extracted fields
     */
    private extractFieldsFromObject(data: object, fields: string[]): { [field: string]: any } {
        const extracted = {};
        for (const key of fields) {
            extracted[key] = data[key];
            delete data[key];
        }
        return extracted;
    }

    async getMatchingLoginData(
        matchingInstance: StrategyInstance,
        matchingStrategy: Strategy,
        imsUserTemplatedValues: object,
        imsUser: {
            id: string;
            username?: string;
            displayName: string;
            email?: string;
        },
    ): Promise<UserLoginData> {
        const requiredLoginDataData = matchingStrategy.getLoginDataDataForImsUserTemplatedFields({
            ...imsUserTemplatedValues,
            id: imsUser.id,
            username: imsUser.username,
            displayName: imsUser.displayName,
            email: imsUser.email,
        });
        if (!requiredLoginDataData) {
            throw new Error(
                "Strategy did not provide required login data data field for ims user. " +
                    "Make sure, the strategy can sync.",
            );
        }

        const matchingLoginData = await this.loginDataService.findForStrategyWithDataContaining(
            matchingInstance,
            requiredLoginDataData,
        );

        if (matchingLoginData.length != 1) {
            throw new Error(`Not exactly one (${matchingLoginData.length}) login data matched the ims user given`);
        }

        return matchingLoginData[0];
    }

    async findLoginDataForImsUser(imsUserId: string): Promise<UserLoginData> {
        const imsUserWithDetail = (await this.graphqlService.sdk.getImsUserDetails({ imsUserId })).node;
        if (imsUserWithDetail.__typename != "IMSUser") {
            throw new Error("id is not a ims user id");
        }

        const ims = imsUserWithDetail.ims;
        const imsTemplatedValues = jsonFieldArrayToObject(ims.templatedFields);
        const matchingInstance = await this.getMatchingInstance(ims, imsTemplatedValues);

        const imsUserTemplatedValues = jsonFieldArrayToObject(imsUserWithDetail["templatedFields"] ?? []);
        return this.getMatchingLoginData(
            matchingInstance.instance,
            matchingInstance.strategy,
            imsUserTemplatedValues,
            imsUserWithDetail,
        );
    }

    //todo: make more efficient (optimization by aggregating all imsusers created in one sync run)
    async createAndLinkSingleImsUser(imsUserId: string): Promise<UserLoginDataImsUser> {
        const existingImsUser = await this.imsUserService.findOneBy({
            neo4jId: imsUserId,
        });
        if (existingImsUser) {
            return existingImsUser;
        }
        const loginData = await this.findLoginDataForImsUser(imsUserId);

        let newImsUser = new UserLoginDataImsUser();
        newImsUser.neo4jId = imsUserId;
        newImsUser.loginData = Promise.resolve(loginData);
        newImsUser = await this.imsUserService.save(newImsUser);

        const loginUser = await loginData.user;
        if (loginUser) {
            this.backendUserService.linkOneImsUserToGropiusUser(loginUser, newImsUser);
        }

        return newImsUser;
    }

    async findImsUserIdsForLoginData(
        loginData: UserLoginData,
    ): Promise<{ imsUserIds: string[]; imsIdsWithoutImsUsers: string[] }> {
        const strategyInstance = await loginData.strategyInstance;
        const strategy = this.strategiesService.getStrategyByName(strategyInstance.type);

        const requiredImsTemplatedValues = await strategy.getImsTemplatedValuesForStrategyInstance(strategyInstance);
        if (!requiredImsTemplatedValues) {
            throw new Error(
                "Strategy instance did not provide required ims template values. Make sure the strategy can sync",
            );
        }
        const directRequiredIms = this.extractFieldsFromObject(requiredImsTemplatedValues, [
            "id",
            "name",
            "description",
        ]);
        const requiredImsTemplatedValuesAsArray = objectToJsonFieldArray(requiredImsTemplatedValues);

        const requiredUserTemplatedFields = strategy.getImsUserTemplatedValuesForLoginData(loginData);
        if (!requiredUserTemplatedFields) {
            throw new Error(
                "Strategy did not provide required IMSUser templated field values. Make sure the strategy can sync",
            );
        }
        const directRequiredUser = this.extractFieldsFromObject(requiredUserTemplatedFields, [
            "id",
            "username",
            "displayName",
            "email",
        ]);
        const requiredUserTemplatedFieldsAsArray = objectToJsonFieldArray(requiredUserTemplatedFields);

        const matchingImsUsers = await this.graphqlService.sdk.getImsUsersByTemplatedFieldValues({
            imsFilterInput: {
                ...directRequiredIms,
                templatedFields: requiredImsTemplatedValuesAsArray,
            },
            userFilterInput: {
                ...directRequiredUser,
                templatedFields: requiredUserTemplatedFieldsAsArray,
            },
        });

        this.logger.debug("Retrieved matching imss and ims users:", matchingImsUsers);
        return {
            imsUserIds: matchingImsUsers.imss.nodes.flatMap((ims) => ims.users.nodes.map((user) => user.id)),
            imsIdsWithoutImsUsers: matchingImsUsers.imss.nodes
                .filter((ims) => ims.users.nodes.length == 0)
                .map((ims) => ims.id),
        };
    }

    async createNewImsUserInBackendForLoginDataAndIms(loginData: UserLoginData, imsId: string): Promise<string> {
        const strategyInstance = await loginData.strategyInstance;
        const strategy = this.strategiesService.getStrategyByName(strategyInstance.type);
        const templatedFieldValuesForImsUser = strategy.getImsUserTemplatedValuesForLoginData(loginData);
        const directValues = this.extractFieldsFromObject(templatedFieldValuesForImsUser, [
            "id",
            "username",
            "displayName",
            "email",
        ]);
        const templatedValuesAsArray = objectToJsonFieldArray(templatedFieldValuesForImsUser);
        let findPossibleDisplayName = directValues["displayName"] ?? directValues["username"] ?? directValues["email"];
        if (!findPossibleDisplayName) {
            for (const key in templatedFieldValuesForImsUser) {
                if (Object.prototype.hasOwnProperty.call(templatedFieldValuesForImsUser, key)) {
                    const value = templatedFieldValuesForImsUser[key];
                    if (value) {
                        findPossibleDisplayName = value;
                        break;
                    }
                }
            }
        }
        const result = await this.graphqlService.sdk.createNewImsUserInIms({
            input: {
                ims: imsId,
                username: directValues["username"],
                displayName: findPossibleDisplayName ?? "Unknown username",
                email: directValues["email"],
                templatedFields: templatedValuesAsArray,
            },
        });
        return result.createIMSUser.imsuser.id;
    }

    async createAndLinkImsUsersForLoginData(loginData: UserLoginData): Promise<UserLoginDataImsUser[]> {
        const { imsUserIds, imsIdsWithoutImsUsers } = await this.findImsUserIdsForLoginData(loginData);

        const listOfKnownImsUsers = await Promise.all(
            imsUserIds.map(async (id) => {
                const imsUser = await this.imsUserService.findOneBy({
                    neo4jId: id,
                });
                const loginDataId = (await imsUser?.loginData)?.id ?? null;
                return { id, imsUser, loginDataId };
            }),
        );

        const imsUserWithDifferentLoginData = listOfKnownImsUsers.find(
            (result) => (result.loginDataId != null || result.imsUser != null) && result.loginDataId != loginData.id,
        );
        if (!!imsUserWithDifferentLoginData) {
            throw new Error(
                `The filtered resulting ims users included at least one ims user ` +
                    `that is already assigned to another login data.\n ` +
                    `This very likely means the filters of strategy instances overlap ` +
                    `or the filters for users are not properly defined.\n ` +
                    `IMSUser id with conflict: ${imsUserWithDifferentLoginData.imsUser.neo4jId}` +
                    `, current login data: ${loginData.id}` +
                    `, conflicting loginData: ${imsUserWithDifferentLoginData.loginDataId}`,
            );
        }

        const backendCreatedImsUsers = await Promise.all(
            imsIdsWithoutImsUsers
                .map((ims) => this.createNewImsUserInBackendForLoginDataAndIms(loginData, ims))
                .map(async (idPromise) => {
                    const id = await idPromise;
                    return { id, imsUser: null, loginDataId: null };
                }),
        );

        const newImsUsers = await Promise.all(
            listOfKnownImsUsers
                .concat(backendCreatedImsUsers)
                .filter((result) => !result.imsUser)
                .map((result) => {
                    const user = new UserLoginDataImsUser();
                    user.neo4jId = result.id;
                    user.loginData = Promise.resolve(loginData);
                    return user;
                })
                .map(async (user) => this.imsUserService.save(user)),
        );

        const loginUser = await loginData.user;
        if (loginUser) {
            await Promise.all(
                newImsUsers.map((imsUser) => this.backendUserService.linkOneImsUserToGropiusUser(loginUser, imsUser)),
            );
        }

        return newImsUsers;
    }
}

import * as passport from "passport";
import { CreateStrategyInstanceInput } from "src/api-login/strategy/dto/create-strategy-instance.dto";
import { UpdateStrategyInstanceInput } from "src/api-login/strategy/dto/update-strategy-instance.dto";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { StrategiesService } from "src/model/services/strategies.service";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { AuthResult, AuthStateData } from "./AuthResult";

export interface StrategyVariable {
    name: string;
    displayName?: string;
    type: "boolean" | "number" | "object" | "string" | "password";
    nullable?: boolean;
}

export abstract class Strategy {
    constructor(
        public readonly typeName: string,
        protected readonly strategyInstanceService: StrategyInstanceService,
        protected readonly strategiesService: StrategiesService,
        public readonly canLoginRegister: boolean = true,
        public readonly canSync: boolean = false,
        public readonly needsRedirectFlow = false,
        public readonly allowsImplicitSignup = false,
    ) {
        strategiesService.addStrategy(typeName, this);
    }

    /**
     * Checks the given config for a instance and extends it (e.g. with default values)
     * of this strategy for validity
     *
     * For strategies that can sync, this checks the existance and format of
     * `imsTemplatedFieldsFilter` in the instance config.
     * This is expected to contain the fields with the values that are expected
     * for an IMS to be considered an ims fot this strategy instance.
     *
     * @param instanceConfig The config object to check for validity
     * @return The instance config in the way as it should be insterted in the instance
     * @throws Any error/exception if the instance config was invalid and no instance may be crated
     */
    protected checkAndExtendInstanceConfig(instanceConfig: object): object {
        if (this.canSync) {
            const imsTemplatedFieldsFilter = instanceConfig["imsTemplatedFieldsFilter"];
            if (!imsTemplatedFieldsFilter) {
                throw new Error(
                    "Instances of strategies that can sync must configure the `imsTemplatedFieldsFilter` " +
                        "on the instance config that sets the expected templated values on the ims",
                );
            }
            if (typeof imsTemplatedFieldsFilter !== "object") {
                throw new Error(
                    "`imsTemplatedFieldsFilter`must be a object/json on the fields " +
                        "and values that are expected on the ims",
                );
            }
        }
        return instanceConfig;
    }

    private updateCapabilityFlags(patrentValue: boolean, useDefault: boolean, inputValue?: boolean | null): boolean {
        if (inputValue == null || inputValue == undefined) {
            if (useDefault) {
                return patrentValue;
            }
        } else if (typeof inputValue == "boolean") {
            return patrentValue && inputValue;
        } else {
            throw new Error("Input value must be boolean");
        }
    }

    async createOrUpdateNewInstance(
        input: CreateStrategyInstanceInput | UpdateStrategyInstanceInput,
        instanceToUpdate?: StrategyInstance,
    ): Promise<StrategyInstance> {
        const createNew = instanceToUpdate == undefined;
        if (createNew) {
            const givenType = (input as CreateStrategyInstanceInput)?.type;
            if (!givenType) {
                throw new Error("No strategy type given. 'type' input is required");
            } else if (givenType !== this.typeName) {
                throw new Error("Called createNewInstance on wrong strategy type");
            }
        }
        let resultingInstanceConfig: object;
        if (createNew || input.instanceConfig) {
            resultingInstanceConfig = this.checkAndExtendInstanceConfig(input.instanceConfig || {});
        }
        const instance = createNew ? new StrategyInstance(this.typeName) : instanceToUpdate;
        instance.doesImplicitRegister = this.updateCapabilityFlags(
            this.allowsImplicitSignup && this.canLoginRegister,
            createNew,
            input.doesImplicitRegister,
        );
        instance.isLoginActive = this.updateCapabilityFlags(this.canLoginRegister, createNew, input.isLoginActive);
        instance.isSelfRegisterActive = this.updateCapabilityFlags(
            this.canLoginRegister,
            createNew,
            input.isSelfRegisterActive,
        );
        instance.isSyncActive = this.updateCapabilityFlags(this.canSync, createNew, input.isSyncActive);
        if (createNew || input.name !== undefined) {
            instance.name = input.name?.replace(/[^a-zA-Z0-9+/\-_= ]/g, "") ?? null;
        }
        if (createNew || input.instanceConfig) {
            instance.instanceConfig = resultingInstanceConfig ?? {};
        }

        return await this.strategyInstanceService.save(instance);
    }

    async existsInstanceClearName(name: string): Promise<boolean> {
        return (await this.strategyInstanceService.countBy({ name })) > 0;
    }

    async getAllInstances(): Promise<StrategyInstance[]> {
        return this.strategyInstanceService.findBy({ type: this.typeName });
    }

    async getInstanceById(id: string): Promise<StrategyInstance> {
        return this.strategyInstanceService.findOneBy({
            id,
            type: this.typeName,
        });
    }

    get acceptsVariables(): {
        [variableName: string]: StrategyVariable;
    } {
        return {};
    }

    getSyncDataForLoginData(
        loginData: UserLoginData,
    ): { token: string | null; [key: string]: any } | Promise<{ token: string | null; [key: string]: any }> {
        return { token: null };
    }

    /**
     * Returns the object containing the templated fields and their values that an *IMS* needs to match,
     * in order to be considered tha IMS that is represented by the strategy instance given.
     * Values will be compared field by field with the templated values of the IMS.
     *
     * The fields `id`, `name` and `description` of the returned object will not be compared to the templated values,
     * but instead to the actual fields of the IMS with those respective names.
     *
     * For example: The API-Url must match in order for a GitHub IMS belonging to a GitHub strategy instance
     *
     * Can/Should be overridden by strategies capable of sync.
     * Default implementation returns `imsTemplatedFieldsFilter` of instance config
     *
     * @param instance The strategy instance for which the templated values should be retuned
     * @returns An object which, if it matches the templated fields of an IMS,
     * the given instance is the matching strategy instance for that IMS
     * Null if the strategy does not sync
     */
    getImsTemplatedValuesForStrategyInstance(instance: StrategyInstance): object | null | Promise<object | null> {
        if (this.canSync) {
            return instance.instanceConfig["imsTemplatedFieldsFilter"];
        }
        return null;
    }

    /**
     * Returns the object containing the templated fields and their values that an *IMSUser* needs to match,
     * in order to be considered an IMSUser that belongs to the given `loginData`
     * (i.e. the IMS is a login of the user of this login data on the ims of this login data)
     *
     * The fields `id`, `username`, `displayName` and `email` of the returned object
     * will not be compared to the templated values,
     * but instead to the actual fields of the IMSUser with those respective names.
     *
     * For example: The username on GitHub must match the username in the login data.
     *
     * Can/Should/Must be overridden by strategies capable of sync.
     * Default implementation returns the `loginData.data` field unchanged
     *
     * @param loginData The login data for which the templated field values should be returned,
     * representing a login of the user using a strategy instance
     * @returns An object which, if it matches the templated fields of an IMSUser,
     * the given loginData is the matching login for that IMSUser
     * Null if the strategy does not sync
     */
    getImsUserTemplatedValuesForLoginData(loginData: UserLoginData): object | null | Promise<object | null> {
        if (this.canSync) {
            return loginData.data;
        }
        return null;
    }

    /**
     * Does the opposite of `getImsUserTemplatedValuesForLoginData`.
     *
     * Returns an object that needs to match the data field of a `LoginData`
     * in order for the IMSUser to be considerd matching the login data.
     *
     * The `imsUserTemplatedFields` should also contain the fields
     * `id`, `username`, `displayName` and `email` directly of the IMSUser
     * in addition to the templated fields and values.
     *
     * For example: Given templated fields of an IMSUser containing its username,
     * this should return the login data object that
     * also matches the user with that username
     *
     * Can/Should/Must be overridden by strategies capable of sync.
     * Default implementation returns the `imsUserTemplatedFields` unchanged
     *
     *
     * @param imsUserTemplatedFields Templated fields and values as well as the fields
     * `id`, `username`, `displayName` and `email` of the IMSUser.
     * @returns An object, that the `.data` field of a login data needs to match.
     */
    getLoginDataDataForImsUserTemplatedFields(imsUserTemplatedFields: object): object | null | Promise<object | null> {
        if (this.canSync) {
            return imsUserTemplatedFields;
        }
        return null;
    }

    /**
     * For a given login data return data that has been retrieved from the authentication source
     * with which to prefill the input fields for the user registration
     *
     * **WARNING**: Does not check wether the returned data is valid or e.g. a username is unique.
     * This is purely a data mapper.
     *
     * @param loginData The login data of the authentication for which to retrieve the data
     * @returns Suggestions for the user data based on the login data. NOT checked!
     */
    getUserDataSuggestion(loginData: UserLoginData): { username?: string; displayName?: string; email?: string } {
        return {};
    }

    abstract performAuth(
        strategyInstance: StrategyInstance,
        authStateData: AuthStateData | object,
        req: any,
        res: any,
    ): Promise<{
        result: AuthResult | null;
        returnedState: AuthStateData;
        info: any;
    }>;

    toJSON() {
        return {
            typeName: this.typeName,
            canLoginRegister: this.canLoginRegister,
            canSync: this.canSync,
            needsRedirectFlow: this.needsRedirectFlow,
            allowsImplicitSignup: this.allowsImplicitSignup,
            acceptsVariables: this.acceptsVariables,
        };
    }
}

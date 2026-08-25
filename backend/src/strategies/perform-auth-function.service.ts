import { Injectable, Logger } from "@nestjs/common";
import { ActiveLogin } from "../model/postgres/ActiveLogin.entity.js";
import { StrategyInstance } from "../model/postgres/StrategyInstance.entity.js";
import { LoginState, UserLoginData } from "../model/postgres/UserLoginData.entity.js";
import { ActiveLoginService } from "../model/services/active-login.service.js";
import { UserLoginDataService } from "../model/services/user-login-data.service.js";
import { type AuthResult, FlowType } from "./AuthResult.js";
import { Strategy } from "./Strategy.js";
import { OAuthHttpException } from "../errors/OAuthHttpException.js";
import { AuthException } from "../errors/AuthException.js";
import { Context } from "../util/Context.js";

/**
 * Contains the logic how the system is supposed to create and link
 * login data and active logins when users authenticate.
 * Defines how the sign up and sign in prcess work from the point
 * when passport has processed the request and returned information about the credentials
 */
@Injectable()
export class PerformAuthFunctionService {
    private readonly logger = new Logger(PerformAuthFunctionService.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly userLoginDataService: UserLoginDataService,
    ) {}

    /**
     * Checks whether the strategy instance may be used for what the flow is asking for.
     *
     * @param context The context of the request, its flow determines what is asked for
     * @param instance The strategy instance the user authenticated with
     * @param strategy The strategy of that instance
     * @returns The reason it is not allowed, or null if it is
     */
    public checkFunctionIsAllowed(context: Context, instance: StrategyInstance, strategy: Strategy): string | null {
        const type = context.flow.getType();

        if (type == FlowType.REGISTER_WITH_SYNC && !strategy.canSync) {
            context.flow.setType(FlowType.REGISTER);
        }
        if (context.flow.isLinkFlow()) {
            return null;
        }
        if (!strategy.canLoginRegister) {
            return "This strategy type does not support login/registration.";
        }
        if (!instance.isLoginActive) {
            return "Login using this strategy instance not enabled";
        }
        // the flow type may have been changed above, so it has to be read again
        const requestedType = context.flow.getType();
        const isSelfRegister = requestedType == FlowType.REGISTER || requestedType == FlowType.REGISTER_WITH_SYNC;
        if (isSelfRegister && !instance.isSelfRegisterActive) {
            return "Registration using this strategy instance not enabled";
        }
        return null;
    }

    private async createActiveLogin(
        instance: StrategyInstance,
        data: object,
        loginData: UserLoginData,
        supportsSync: boolean,
    ): Promise<ActiveLogin> {
        const activeLogin = new ActiveLogin(instance);
        activeLogin.data = data;
        activeLogin.loginInstanceFor = Promise.resolve(loginData);
        activeLogin.supportsSync = supportsSync;
        return this.activeLoginService.save(activeLogin);
    }

    private async loginExistingUser(authResult: AuthResult, instance: StrategyInstance): Promise<ActiveLogin> {
        this.logger.debug("Logging in user");
        return this.createActiveLogin(instance, authResult.dataActiveLogin, authResult.loginData, false);
    }

    private async continueExistingRegistration(
        authResult: AuthResult,
        instance: StrategyInstance,
        supportsSync: boolean,
    ): Promise<ActiveLogin> {
        const loginData = authResult.loginData;
        loginData.data = authResult.dataUserLoginData;
        await this.userLoginDataService.save(loginData);
        return this.createActiveLogin(instance, authResult.dataActiveLogin, authResult.loginData, supportsSync);
    }

    private async registerNewUser(
        authResult: AuthResult,
        instance: StrategyInstance,
        supportsSync: boolean,
    ): Promise<ActiveLogin> {
        this.logger.debug("Registering new user with login data", authResult.dataUserLoginData);
        let loginData = new UserLoginData();
        loginData.data = authResult.dataUserLoginData;
        loginData.state = LoginState.WAITING_FOR_REGISTER;
        loginData.strategyInstance = Promise.resolve(instance);
        loginData = await this.userLoginDataService.save(loginData);
        return this.createActiveLogin(instance, authResult.dataActiveLogin, loginData, supportsSync);
    }

    public async performRequestedAction(
        authResult: AuthResult,
        context: Context,
        instance: StrategyInstance,
        strategy: Strategy,
    ): Promise<ActiveLogin> {
        const flowType = context.flow.getType();
        const wantsToDoImplicitRegister =
            strategy.allowsImplicitSignup && instance.doesImplicitRegister && flowType == FlowType.LOGIN;
        if (flowType != FlowType.LOGIN && !authResult.mayRegister) {
            throw new AuthException("Cannot register", instance.id);
        }
        if (authResult.loginData) {
            // successfully found login data matching the authentication
            switch (authResult.loginData.state) {
                case LoginState.WAITING_FOR_REGISTER:
                    if (
                        flowType == FlowType.REGISTER ||
                        flowType == FlowType.REGISTER_WITH_SYNC ||
                        wantsToDoImplicitRegister
                    ) {
                        return this.continueExistingRegistration(
                            authResult,
                            instance,
                            flowType == FlowType.REGISTER_WITH_SYNC,
                        );
                    } else if (flowType == FlowType.LOGIN) {
                        throw new OAuthHttpException(
                            "server_error",
                            "For these credentials a registration process is still running. Complete (or restart) the registration before logging in",
                        );
                    }
                case LoginState.BLOCKED:
                    throw new OAuthHttpException(
                        "server_error",
                        "The login to this account using this specific strategy instance was blocked by the administrator.",
                    );
                case LoginState.VALID:
                    return this.loginExistingUser(authResult, instance);
            }
        } else {
            if (flowType == FlowType.REGISTER || flowType == FlowType.REGISTER_WITH_SYNC || wantsToDoImplicitRegister) {
                if (!authResult.mayRegister) {
                    this.logger.warn("Strategy did not provide existing loginData but it did not allow registering");
                    throw new OAuthHttpException("server_error", "Invalid user credentials.");
                }

                return this.registerNewUser(authResult, instance, flowType == FlowType.REGISTER_WITH_SYNC);
            } else if (flowType == FlowType.LOGIN && !wantsToDoImplicitRegister) {
                throw new AuthException(authResult.noRegisterMessage ?? "Invalid user credentials.", instance.id);
            }
        }
        throw new OAuthHttpException("server_error", "Unknown error during authentication");
    }
}

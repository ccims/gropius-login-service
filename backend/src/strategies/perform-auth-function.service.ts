import { Injectable, Logger } from "@nestjs/common";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { AuthResult, FlowType } from "./AuthResult";
import { Strategy } from "./Strategy";
import { OAuthHttpException } from "src/api-oauth/OAuthHttpException";
import { AuthException } from "src/api-internal/AuthException";
import { Context } from "../util/Context";

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
        return null;
    }

    async createActiveLogin(
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

import { Injectable, Logger } from "@nestjs/common";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { LoginUserService } from "src/model/services/login-user.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { AuthStateData, AuthFunction, AuthResult } from "./AuthResult";
import { StrategiesService } from "../model/services/strategies.service";
import { Strategy } from "./Strategy";

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
        private readonly loginUserService: LoginUserService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly userLoginDataService: UserLoginDataService,
        private readonly strategiesService: StrategiesService,
    ) {}

    public checkFunctionIsAllowed(state: AuthStateData, instance: StrategyInstance, strategy: Strategy): string | null {
        switch (state?.function) {
            case AuthFunction.REGISTER_WITH_SYNC:
                if (!strategy.canSync) {
                    state.function = AuthFunction.REGISTER;
                }
            //Fallthrough to check if registration is possible at all
            case AuthFunction.REGISTER:
                if (!strategy.canLoginRegister && !strategy.canSync) {
                    return "This strategy does not support either login nor sync";
                }
                break;
            case AuthFunction.LOGIN:
                if (!strategy.canLoginRegister) {
                    return "This strategy type does not support login/registration.";
                }
                if (!instance.isLoginActive) {
                    return "Login using this strategy instance not enabled";
                }
                break;
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
        activeLogin.expires = new Date(Date.now() + parseInt(process.env.GROPIUS_REGISTRATION_EXPIRATION_TIME_MS, 10));
        return this.activeLoginService.save(activeLogin);
    }

    private async loginExistingUser(authResult: AuthResult, instance: StrategyInstance): Promise<AuthStateData> {
        this.logger.debug("Logging in user");
        return {
            activeLogin: await this.createActiveLogin(
                instance,
                authResult.dataActiveLogin,
                authResult.loginData,
                false,
            ),
        };
    }

    private async continueExistingRegistration(
        authResult: AuthResult,
        instance: StrategyInstance,
        supportsSync: boolean,
    ): Promise<AuthStateData> {
        let loginData = authResult.loginData;
        loginData.data = authResult.dataUserLoginData;
        const newExpiryDate = new Date(Date.now() + parseInt(process.env.GROPIUS_REGISTRATION_EXPIRATION_TIME_MS, 10));
        if (loginData.expires != null && loginData.expires < newExpiryDate) {
            loginData.expires = newExpiryDate;
        }
        loginData = await this.userLoginDataService.save(loginData);
        return {
            activeLogin: await this.createActiveLogin(
                instance,
                authResult.dataActiveLogin,
                authResult.loginData,
                supportsSync,
            ),
        };
    }

    private async registerNewUser(
        authResult: AuthResult,
        instance: StrategyInstance,
        supportsSync: boolean,
    ): Promise<AuthStateData> {
        this.logger.debug("Registering new user with login data", authResult.dataUserLoginData);
        let loginData = new UserLoginData();
        loginData.data = authResult.dataUserLoginData;
        loginData.expires = new Date(Date.now() + parseInt(process.env.GROPIUS_REGISTRATION_EXPIRATION_TIME_MS, 10));
        loginData.state = LoginState.WAITING_FOR_REGISTER;
        loginData.strategyInstance = Promise.resolve(instance);
        loginData = await this.userLoginDataService.save(loginData);
        return {
            activeLogin: await this.createActiveLogin(instance, authResult.dataActiveLogin, loginData, supportsSync),
        };
    }

    public async performRequestedAction(
        authResult: AuthResult,
        state: AuthStateData,
        instance: StrategyInstance,
        strategy: Strategy,
    ): Promise<AuthStateData> {
        if (authResult.loginData) {
            // sucessfully found login data matching the authentication
            if (authResult.loginData.expires != null && authResult.loginData.expires <= new Date()) {
                // Found login data is expired =>
                // shouldn't happen as expired login data are filtered when searhcing for them
                return {
                    authErrorMessage:
                        "The login using this strategy instance has expired. " +
                        "If you were just registering, try starting the registration again. " +
                        "If this error happens again, something internally went wrong.",
                };
            }
            if (state.function == AuthFunction.REGISTER || state.function == AuthFunction.REGISTER_WITH_SYNC) {
                return this.continueExistingRegistration(
                    authResult,
                    instance,
                    state.function == AuthFunction.REGISTER_WITH_SYNC,
                );
            } else if (state.function == AuthFunction.LOGIN) {
                switch (authResult.loginData.state) {
                    case LoginState.WAITING_FOR_REGISTER:
                        return {
                            authErrorMessage:
                                "For these credentials a registration process is still running. " +
                                "Complete (or restart) the registration before logging in",
                        };
                    case LoginState.BLOCKED:
                        return {
                            authErrorMessage:
                                "The login to this account using this specific strategy instance " +
                                "was blocked by the administrator.",
                        };
                    case LoginState.VALID:
                        return this.loginExistingUser(authResult, instance);
                }
            }
        } else {
            const wantsToDoImplicitRegister =
                strategy.allowsImplicitSignup && instance.doesImplicitRegister && state.function == AuthFunction.LOGIN;
            if (
                state.function == AuthFunction.REGISTER ||
                state.function == AuthFunction.REGISTER_WITH_SYNC ||
                wantsToDoImplicitRegister
            ) {
                if (!authResult.mayRegister) {
                    this.logger.warn("Strategy did not provide existing loginData but it did not allow registering");
                    return { authErrorMessage: "Invalid user credentials." };
                }

                return this.registerNewUser(authResult, instance, state.function == AuthFunction.REGISTER_WITH_SYNC);
            } else if (state.function == AuthFunction.LOGIN && !wantsToDoImplicitRegister) {
                return { authErrorMessage: "Invalid user credentials." };
            }
        }
        return { authErrorMessage: "Unknown error during authentication" };
    }
}

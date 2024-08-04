import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { ImsUserFindingService } from "src/backend-services/ims-user-finding.service";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { AuthStateServerData } from "./AuthResult";
import { PerformAuthFunctionService } from "./perform-auth-function.service";
import { StrategiesService } from "../model/services/strategies.service";
import { Strategy } from "./Strategy";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
import { OAuthHttpException } from "src/api-oauth/OAuthHttpException";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";
import { AuthException } from "src/api-internal/AuthException";

@Injectable()
export class StrategiesMiddleware extends StateMiddleware<
    AuthStateServerData & OAuthAuthorizeServerState,
    AuthStateServerData & OAuthAuthorizeServerState & { strategy: Strategy }
> {
    private readonly logger = new Logger(StrategiesMiddleware.name);
    constructor(
        private readonly strategiesService: StrategiesService,
        private readonly strategyInstanceService: StrategyInstanceService,
        private readonly performAuthFunctionService: PerformAuthFunctionService,
        private readonly imsUserFindingService: ImsUserFindingService,
    ) {
        super();
    }

    private async idToStrategyInstance(id: string): Promise<StrategyInstance> {
        if (!id) {
            throw new HttpException("No Id of strategy instance given", HttpStatus.BAD_REQUEST);
        }
        const instance = await this.strategyInstanceService.findOneBy({ id });
        if (!instance) {
            throw new HttpException(`No Strategy instance with id ${id}`, HttpStatus.NOT_FOUND);
        }
        return instance;
    }

    async performImsUserSearchIfNeeded(state: AuthStateServerData, instance: StrategyInstance, strategy: Strategy) {
        if (strategy.canSync && instance.isSyncActive) {
            if (typeof state.activeLogin == "object" && state.activeLogin.id) {
                const imsUserSearchOnModes = process.env.GROPIUS_PERFORM_IMS_USER_SEARCH_ON.split(",").filter(
                    (s) => !!s,
                );
                if (imsUserSearchOnModes.includes(state.authState.function)) {
                    const loginData = await state.activeLogin.loginInstanceFor;
                    try {
                        await this.imsUserFindingService.createAndLinkImsUsersForLoginData(loginData);
                    } catch (err) {
                        this.logger.error(
                            "Error while linking/creating IMSUsers in the backend (Not canceling request):",
                            err,
                        );
                    }
                }
            }
        }
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: AuthStateServerData & OAuthAuthorizeServerState & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const id = req.params.id;
        const instance = await this.idToStrategyInstance(id);
        const strategy = this.strategiesService.getStrategyByName(instance.type);
        this.appendState(res, { strategy });

        const result = await strategy.performAuth(instance, state, req, res);
        this.appendState(res, result.returnedState);
        const authResult = result.result;
        if (authResult) {
            const functionError = this.performAuthFunctionService.checkFunctionIsAllowed(state, instance, strategy);
            if (functionError != null) {
                throw new OAuthHttpException("server_error", functionError);
            }
            const activeLogin = await this.performAuthFunctionService.performRequestedAction(
                authResult,
                state,
                instance,
                strategy,
            );
            this.appendState(res, { activeLogin });
            state.authState.activeLogin = activeLogin.id;
            await this.performImsUserSearchIfNeeded(state, instance, strategy);
        } else {
            throw new AuthException(
                result.info?.message?.toString() || JSON.stringify(result.info) || "Login unsuccessfull",
                instance.id,
            );
        }
        this.logger.debug("Strategy Middleware completed. Calling next");
        next();
    }
}

import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ImsUserFindingService } from "src/backend-services/ims-user-finding.service";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { PerformAuthFunctionService } from "./perform-auth-function.service";
import { StrategiesService } from "../model/services/strategies.service";
import { Strategy } from "./Strategy";
import { OAuthHttpException } from "src/api-oauth/OAuthHttpException";
import { AuthException } from "src/api-internal/AuthException";
import { State } from "../util/State";

@Injectable()
export class StrategiesMiddleware implements NestMiddleware {
    private readonly logger = new Logger(StrategiesMiddleware.name);

    constructor(
        private readonly strategiesService: StrategiesService,
        private readonly strategyInstanceService: StrategyInstanceService,
        private readonly performAuthFunctionService: PerformAuthFunctionService,
        private readonly imsUserFindingService: ImsUserFindingService,
    ) {}

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

    async performImsUserSearchIfNeeded(state: State, instance: StrategyInstance, strategy: Strategy) {
        if (!state.authState) throw new Error("Active login missing");

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

    async use(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const instance = await this.idToStrategyInstance(id);
        const strategy = this.strategiesService.getStrategyByName(instance.type);
        res.appendState({ strategy });

        const result = await strategy.performAuth(instance, res.state, req, res);
        res.appendState(result.returnedState);
        const authResult = result.result;
        if (authResult) {
            const functionError = this.performAuthFunctionService.checkFunctionIsAllowed(res.state, instance, strategy);
            if (functionError != null) {
                throw new OAuthHttpException("server_error", functionError);
            }
            const activeLogin = await this.performAuthFunctionService.performRequestedAction(
                authResult,
                res.state,
                instance,
                strategy,
            );

            // TODO: why cant we do this on res.state?
            const stateCopy = Object.assign({}, res.state);
            stateCopy.authState.activeLogin = activeLogin.id;

            res.appendState({ activeLogin });
            await this.performImsUserSearchIfNeeded(stateCopy, instance, strategy);
        } else {
            throw new AuthException(
                result.info?.message?.toString() || JSON.stringify(result.info) || "Login unsuccessfully",
                instance.id,
            );
        }
        this.logger.debug("Strategy Middleware completed. Calling next");
        next();
    }
}

import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { ImsUserFindingService } from "src/backend-services/ims-user-finding.service";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { AuthFunction, AuthStateData } from "./AuthResult";
import { PerformAuthFunctionService } from "./perform-auth-function.service";
import { StrategiesService } from "../model/services/strategies.service";
import { Strategy } from "./Strategy";
import { ensureState } from "./utils";

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

    async performImsUserSearchIfNeeded(state: AuthStateData, instance: StrategyInstance, strategy: Strategy) {
        if (strategy.canSync && instance.isSyncActive) {
            if (typeof state.activeLogin == "object" && state.activeLogin.id) {
                const imsUserSearchOnModes = process.env.GROPIUS_PERFORM_IMS_USER_SEARCH_ON.split(",").filter(
                    (s) => !!s,
                );
                if (imsUserSearchOnModes.includes(state.function)) {
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

    async use(req: Request, res: Response, next: () => void) {
        ensureState(res);
        if ((res.locals.state as AuthStateData)?.authErrorMessage) {
            next();
        }
        const id = req.params.id;
        const instance = await this.idToStrategyInstance(id);
        const strategy = await this.strategiesService.getStrategyByName(instance.type);

        const functionError = this.performAuthFunctionService.checkFunctionIsAllowed(
            res.locals.state,
            instance,
            strategy,
        );
        if (functionError != null) {
            (res.locals.state as AuthStateData).authErrorMessage = functionError;
            return next();
        }

        const result = await strategy.performAuth(instance, res.locals.state || {}, req, res);
        res.locals.state = { ...res.locals.state, ...result.returnedState };

        const authResult = result.result;
        if (authResult) {
            const executionResult = await this.performAuthFunctionService.performRequestedAction(
                authResult,
                res.locals.state,
                instance,
                strategy,
            );
            res.locals.state = { ...res.locals.state, ...executionResult };
            await this.performImsUserSearchIfNeeded(res.locals.state, instance, strategy);
        } else {
            (res.locals.state as AuthStateData).authErrorMessage =
                result.info?.message?.toString() || JSON.stringify(result.info) || "Login unsuccessfull";
        }
        next();
    }
}

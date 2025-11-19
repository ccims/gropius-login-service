import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { ImsUserFindingService } from "src/backend-services/ims-user-finding.service";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { PerformAuthFunctionService } from "./perform-auth-function.service";
import { StrategiesService as StrategiesRepository } from "../model/services/strategies.service";
import { Strategy } from "./Strategy";
import { OAuthHttpException } from "src/errors/OAuthHttpException";
import { AuthException } from "src/errors/AuthException";
import { Context, FlowState } from "../util/Context";
import { ActiveLogin } from "../model/postgres/ActiveLogin.entity";
import { compareTimeSafe } from "../util/utils";

@Injectable()
export class StrategiesService implements NestMiddleware {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly strategiesRepository: StrategiesRepository,
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

    private async performImsUserSearchIfNeeded(
        context: Context,
        instance: StrategyInstance,
        strategy: Strategy,
        activeLogin: ActiveLogin,
    ) {
        if (strategy.canSync && instance.isSyncActive) {
            if (typeof activeLogin == "object" && activeLogin.id) {
                const imsUserSearchOnModes = process.env.GROPIUS_PERFORM_IMS_USER_SEARCH_ON.split(",").filter(
                    (s) => !!s,
                );
                if (imsUserSearchOnModes.includes(context.flow.getType())) {
                    const loginData = await activeLogin.loginInstanceFor;
                    try {
                        await this.imsUserFindingService.createAndLinkImsUsersForLoginData(loginData);
                    } catch (err: any) {
                        this.logger.error(
                            "Error while linking/creating IMSUsers in the backend (Not canceling request):",
                            err,
                        );
                    }
                }
            }
        }
    }

    async use(req: Request, res: Response) {
        const id = req.params.id;

        const instance = await this.idToStrategyInstance(id);
        const strategy = this.strategiesRepository.getStrategyByName(instance.type);
        req.context.flow.setStrategy(strategy);

        const result = await strategy.performAuth(instance, req.context, req, res);

        if (strategy.needsRedirectFlow) {
            if (!compareTimeSafe(result.returnedState.csrf, req.context.auth.getCSRF()))
                throw new Error("Invalid session-bound CSRF token provided");

            if (!compareTimeSafe(result.returnedState.flow, req.context.flow.getId()))
                throw new Error("Invalid flow-bound CSRF token provided");
        }

        const authResult = result.result;
        if (!authResult) {
            throw new AuthException(
                result.info?.message?.toString() || JSON.stringify(result.info) || "Login unsuccessfully",
                instance.id,
            );
        }

        const functionError = this.performAuthFunctionService.checkFunctionIsAllowed(req.context, instance, strategy);
        if (functionError) {
            throw new OAuthHttpException("server_error", functionError);
        }

        const activeLogin = await this.performAuthFunctionService.performRequestedAction(
            authResult,
            req.context,
            instance,
            strategy,
        );
        req.context.flow.setActiveLogin(activeLogin);

        await this.performImsUserSearchIfNeeded(req.context, instance, strategy, activeLogin);

        this.logger.debug("Strategy Middleware completed. Calling next");
    }
}

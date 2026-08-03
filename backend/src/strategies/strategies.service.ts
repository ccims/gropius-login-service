import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { ImsUserFindingService } from "../backend-services/ims-user-finding.service.js";
import { StrategyInstance } from "../model/postgres/StrategyInstance.entity.js";
import { StrategyInstanceService } from "../model/services/strategy-instance.service.js";
import { PerformAuthFunctionService } from "./perform-auth-function.service.js";
import { StrategiesService as StrategiesRepository } from "../model/services/strategies.service.js";
import { Strategy } from "./Strategy.js";
import { OAuthHttpException } from "../errors/OAuthHttpException.js";
import { AuthException } from "../errors/AuthException.js";
import { Context } from "../util/Context.js";
import { ActiveLogin } from "../model/postgres/ActiveLogin.entity.js";
import { compareTimeSafe } from "../util/utils.js";

@Injectable()
export class StrategiesService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly strategiesRepository: StrategiesRepository,
        private readonly strategyInstanceService: StrategyInstanceService,
        private readonly performAuthFunctionService: PerformAuthFunctionService,
        private readonly imsUserFindingService: ImsUserFindingService,
    ) {}

    // Express 5 types route params as `string | string[]`, as wildcard segments can repeat.
    // ":id" never does, so anything but a single string is a malformed request.
    private async idToStrategyInstance(id: string | string[]): Promise<StrategyInstance> {
        if (!id || typeof id !== "string") {
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
            if (!compareTimeSafe(result.returnedState.csrf, req.context.auth.getCSRF())) {
                throw new Error("Invalid session-bound CSRF token provided");
            }

            if (!compareTimeSafe(result.returnedState.flow, req.context.flow.getId())) {
                throw new Error("Invalid flow-bound CSRF token provided");
            }
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

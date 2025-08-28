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
import { Context } from "../util/Context";

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

    private async performImsUserSearchIfNeeded(context: Context, instance: StrategyInstance, strategy: Strategy) {
        const activeLogin = context.tryActiveLogin();

        if (strategy.canSync && instance.isSyncActive) {
            if (typeof activeLogin == "object" && activeLogin.id) {
                const imsUserSearchOnModes = process.env.GROPIUS_PERFORM_IMS_USER_SEARCH_ON.split(",").filter(
                    (s) => !!s,
                );
                if (imsUserSearchOnModes.includes(context.getFlowType())) {
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

    async use(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;

        const instance = await this.idToStrategyInstance(id);
        const strategy = this.strategiesService.getStrategyByName(instance.type);
        req.context.setStrategy(instance.type, strategy);

        const result = await strategy.performAuth(instance, req.context, req, res);
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
        req.context.setActiveLogin(activeLogin);

        await this.performImsUserSearchIfNeeded(req.context, instance, strategy);

        this.logger.debug("Strategy Middleware completed. Calling next");
        next();
    }
}

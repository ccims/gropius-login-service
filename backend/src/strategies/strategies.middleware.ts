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
import { FlowInternal } from "../util/FlowInternal";

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

    async performImsUserSearchIfNeeded(internal: FlowInternal, instance: StrategyInstance, strategy: Strategy) {
        const activeLogin = internal.tryActiveLogin();
        const authState = internal.getAuthState();

        if (strategy.canSync && instance.isSyncActive) {
            if (typeof activeLogin == "object" && activeLogin.id) {
                const imsUserSearchOnModes = process.env.GROPIUS_PERFORM_IMS_USER_SEARCH_ON.split(",").filter(
                    (s) => !!s,
                );
                if (imsUserSearchOnModes.includes(authState.function)) {
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
        req.internal.append({ strategy });

        const result = await strategy.performAuth(instance, req.internal, req, res);
        req.internal.append(result.returnedState);
        const authResult = result.result;
        if (authResult) {
            const functionError = this.performAuthFunctionService.checkFunctionIsAllowed(
                req.internal,
                instance,
                strategy,
            );
            if (functionError != null) {
                throw new OAuthHttpException("server_error", functionError);
            }
            const activeLogin = await this.performAuthFunctionService.performRequestedAction(
                authResult,
                req.internal,
                instance,
                strategy,
            );

            // TODO: why do we need to do this?!
            const internalCopy = new FlowInternal();
            internalCopy.append(Object.assign({}, req.internal._internal));
            internalCopy.getAuthState().activeLogin = activeLogin.id;

            req.internal.append({ activeLogin });
            await this.performImsUserSearchIfNeeded(internalCopy, instance, strategy);
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

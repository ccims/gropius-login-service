import * as passport from "passport";
import { PerformAuthResult, PerformAuthState, Strategy } from "./Strategy";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { AuthResult } from "./AuthResult";
import { JwtService } from "@nestjs/jwt";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { StrategiesService } from "src/model/services/strategies.service";
import { Logger } from "@nestjs/common";
import { Request } from "express";
import { Context, FlowState } from "../util/Context";
import { compareTimeSafe } from "../util/utils";
import { EncryptionService } from "../backend-services/encryption.service";

export abstract class StrategyUsingPassport extends Strategy {
    private readonly logger = new Logger(StrategyUsingPassport.name);

    constructor(
        typeName: string,
        strategyInstanceService: StrategyInstanceService,
        strategiesService: StrategiesService,
        private readonly encryptionService: EncryptionService,
        canLoginRegister = true,
        canSync = false,
        needsRedirectFlow = false,
        allowsImplicitSignup = false,
        forceSuggestedUsername = false,
    ) {
        super(
            typeName,
            strategyInstanceService,
            strategiesService,
            canLoginRegister,
            canSync,
            needsRedirectFlow,
            allowsImplicitSignup,
            forceSuggestedUsername,
        );
    }

    abstract createPassportStrategyInstance(strategyInstance: StrategyInstance): passport.Strategy;

    protected getAdditionalPassportOptions(
        strategyInstance: StrategyInstance,
        context: Context | undefined,
    ): passport.AuthenticateOptions {
        return {};
    }

    public override async performAuth(
        strategyInstance: StrategyInstance,
        context: Context | undefined,
        req: Request,
        res: any,
    ): Promise<PerformAuthResult> {
        req.context.flow.setState(FlowState.REDIRECT);
        return new Promise((resolve, reject) => {
            const passportStrategy = this.createPassportStrategyInstance(strategyInstance);
            passport.authenticate(
                passportStrategy,
                {
                    session: false,
                    state: this.encryptionService.encrypt(
                        JSON.stringify({
                            kind: "passport_state",
                            csrf: context?.auth.getCSRF(),
                            flow: context?.flow.getId(),
                        }),
                    ),
                    ...this.getAdditionalPassportOptions(strategyInstance, context),
                },
                (err, user: AuthResult | false, info) => {
                    if (err) {
                        this.logger.error("Error while authenticating with passport", err);
                        reject(err);
                    } else {
                        const stateToken = info.state || req.query?.state;
                        if (!stateToken) return reject("No state returned by passport strategy");
                        const statePayload = JSON.parse(this.encryptionService.decrypt(stateToken)) as PerformAuthState;

                        if (statePayload.kind !== "passport_state")
                            return reject("Invalid state returned by passport strategy");

                        if (!compareTimeSafe(statePayload.csrf, req.context.auth.getCSRF()))
                            return reject("Invalid CSRF token provided");

                        if (!compareTimeSafe(statePayload.flow, req.context.flow.getId()))
                            return reject("Invalid flow id provided");

                        return resolve({ result: user || null, returnedState: statePayload, info });
                    }
                },
            )(req, res, (a) => {
                this.logger.error("next called by passport", a);
                return reject("Next called by passport");
            });
        });
    }
}

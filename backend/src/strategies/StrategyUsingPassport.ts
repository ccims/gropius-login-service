import passport from "passport";
import { type PerformAuthResult, type PerformAuthState, Strategy } from "./Strategy.js";
import { StrategyInstance } from "../model/postgres/StrategyInstance.entity.js";
import type { AuthResult } from "./AuthResult.js";
import { JwtService } from "@nestjs/jwt";
import { StrategyInstanceService } from "../model/services/strategy-instance.service.js";
import { StrategiesService } from "../model/services/strategies.service.js";
import { Logger } from "@nestjs/common";
import type { Request } from "express";
import { Context, FlowState } from "../util/Context.js";
import { compareTimeSafe, ms2s } from "../util/utils.js";

export abstract class StrategyUsingPassport extends Strategy {
    private readonly logger = new Logger(StrategyUsingPassport.name);

    constructor(
        typeName: string,
        strategyInstanceService: StrategyInstanceService,
        strategiesService: StrategiesService,
        private readonly stateJwtService: JwtService,
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
        return new Promise((resolve, reject) => {
            const passportStrategy = this.createPassportStrategyInstance(strategyInstance);
            passport.authenticate(
                passportStrategy,
                {
                    session: false,
                    // Signed, not encrypted: this needs integrity, and encrypting under the *public*
                    // half of a keypair gives none - anyone with that key could mint a state blob.
                    state: this.stateJwtService.sign(
                        {
                            kind: "passport_state",
                            csrf: context?.auth.getCSRF(),
                            flow: context?.flow.getId(),
                        },
                        { expiresIn: ms2s(parseInt(process.env.GROPIUS_FLOW_EXPIRATION_TIME_MS, 10)) },
                    ),
                    ...this.getAdditionalPassportOptions(strategyInstance, context),
                },
                (err, user: AuthResult | false, info) => {
                    if (err) {
                        this.logger.error("Error while authenticating with passport", err);
                        reject(err);
                    } else {
                        let returnedState: PerformAuthState = {};

                        const stateToken = info.state || req.query?.state;
                        if (stateToken) {
                            let statePayload: PerformAuthState;
                            try {
                                statePayload = this.stateJwtService.verify<PerformAuthState>(stateToken);
                            } catch (stateError: unknown) {
                                this.logger.warn("Invalid state returned by passport strategy", stateError);
                                return reject("Invalid state returned by passport strategy");
                            }

                            if (statePayload.kind !== "passport_state") {
                                return reject("Invalid state returned by passport strategy");
                            }

                            returnedState = statePayload;
                        }

                        return resolve({ result: user || null, returnedState: returnedState, info });
                    }
                },
            )(req, res, (a) => {
                this.logger.error("next called by passport", a);
                return reject("Next called by passport");
            });
        });
    }
}

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
import { compareTimeSafe, ms2s } from "../util/utils";

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
                    // Signed rather than encrypted: what this value needs is integrity, and
                    // encrypting under the *public* half of a keypair provides none - anyone
                    // holding that key could mint a state blob. A signature cannot be forged
                    // without the private key. Signing also gives the state an expiry.
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

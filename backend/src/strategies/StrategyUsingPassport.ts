import * as passport from "passport";
import { PerformAuthResult, Strategy } from "./Strategy";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { AuthStateServerData, AuthResult } from "./AuthResult";
import { JwtService } from "@nestjs/jwt";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { StrategiesService } from "src/model/services/strategies.service";
import { Logger } from "@nestjs/common";
import { OAuthAuthorizeServerState } from "src/api-oauth/OAuthAuthorizeServerState";

export abstract class StrategyUsingPassport extends Strategy {
    private readonly logger = new Logger(StrategyUsingPassport.name);
    constructor(
        typeName: string,
        strategyInstanceService: StrategyInstanceService,
        strategiesService: StrategiesService,
        protected readonly stateJwtService: JwtService,
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
        authStateData: (AuthStateServerData & OAuthAuthorizeServerState) | undefined,
    ): passport.AuthenticateOptions {
        return {};
    }

    public override async performAuth(
        strategyInstance: StrategyInstance,
        state: (AuthStateServerData & OAuthAuthorizeServerState) | undefined,
        req: any,
        res: any,
    ): Promise<PerformAuthResult> {
        return new Promise((resolve, reject) => {
            const passportStrategy = this.createPassportStrategyInstance(strategyInstance)
            const jwtService = this.stateJwtService;
            passport.authenticate(
                passportStrategy,
                {
                    session: false,
                    state: jwtService.sign({ request: state?.request, authState: state?.authState }), // TODO: check if an expiration and/or an additional random value are needed
                    ...this.getAdditionalPassportOptions(strategyInstance, state),
                },
                (err, user: AuthResult | false, info) => {
                    if (err) {
                        this.logger.error("Error while authenticating with passport", err);
                        reject(err);
                    } else {
                        let returnedState = {};
                        if (info.state && typeof info.state == "string") {
                            returnedState = jwtService.verify(info.state);
                        } else if (info.state) {
                            reject("State not returned as JWT");
                        }
                        resolve({ result: user || null, returnedState, info });
                    }
                },
            )(req, res, (a) => {
                this.logger.error("next called by passport", a);
                return reject("Next called by passport");
            });
        });
    }
}

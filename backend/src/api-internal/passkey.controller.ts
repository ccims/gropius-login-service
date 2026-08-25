import { Body, Controller, HttpException, HttpStatus, Logger, Param, Post, Req, Res } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import type {
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/server";
import { AuthCSRFService } from "../backend-services/x-auth-csrf.service.js";
import { ContextInitService } from "../backend-services/x-context-init.service.js";
import { FlowCSRFService } from "../backend-services/x-flow-csrf.service.js";
import { LoginUserService } from "../model/services/login-user.service.js";
import { StrategyInstance } from "../model/postgres/StrategyInstance.entity.js";
import { StrategyInstanceService } from "../model/services/strategy-instance.service.js";
import { PasskeyStrategyService } from "../strategies/passkey/passkey.service.js";
import { NoCors } from "../util/NoCors.decorator.js";
import { OpenApiTag } from "../util/openapi-tag.js";
import { PasskeyRegistrationOptionsInput } from "./types.js";

/**
 * Endpoints that start a passkey (WebAuthn) ceremony.
 *
 * A passkey cannot be submitted in one request like a password: the authenticator first has to
 * sign a challenge that we handed out. These endpoints produce that challenge and the options the
 * browser needs, the signed result is then submitted to the regular
 * `auth/submit/:id/:mode` endpoint and verified by the passkey strategy.
 *
 * They are state changing (they store the challenge on the session), so they require both
 * the session-bound and the flow-bound CSRF token, but they do not advance the flow itself.
 *
 * Unlike the submit endpoint they only carry the baseline rate limit, not `AuthRateLimit`:
 * they hand out a random challenge rather than accepting a credential, so there is nothing here
 * for an attacker to guess at speed. Limiting them as tightly as the endpoint that verifies the
 * answer would only halve the attempts a legitimate user gets, since a single passkey login
 * needs one request to each.
 */
@Controller("auth/passkey")
@ApiTags(OpenApiTag.INTERNAL_API)
export class PasskeyController {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly contextInitService: ContextInitService,
        private readonly authCSRFService: AuthCSRFService,
        private readonly flowCSRFService: FlowCSRFService,
        private readonly strategyInstanceService: StrategyInstanceService,
        private readonly passkeyStrategyService: PasskeyStrategyService,
        private readonly userService: LoginUserService,
    ) {}

    /**
     * Creates the options for registering a new passkey on the given strategy instance.
     *
     * If the request comes from an authenticated user, the passkey is created for their account,
     * otherwise for a new account that is registered once the passkey is submitted.
     */
    @Post(":id/registration-options")
    @NoCors()
    @ApiOperation({ summary: "Start registering a passkey for a strategy instance" })
    @ApiParam({ name: "id", type: String, description: "The id of the passkey strategy instance to register on" })
    async registrationOptions(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Param("id") id: string,
        @Body() input: PasskeyRegistrationOptionsInput,
    ): Promise<PublicKeyCredentialCreationOptionsJSON> {
        const instance = await this.initContextAndGetInstance(req, res, id);

        const user = req.context.auth.isAuthenticated()
            ? await this.userService.findOneBy({ id: req.context.auth.getUserId() })
            : undefined;

        return this.passkeyStrategyService.createRegistrationOptions(instance, req.context, user, input?.username);
    }

    /**
     * Creates the options for logging in with an already registered passkey
     * on the given strategy instance.
     */
    @Post(":id/authentication-options")
    @NoCors()
    @ApiOperation({ summary: "Start logging in with a passkey for a strategy instance" })
    @ApiParam({ name: "id", type: String, description: "The id of the passkey strategy instance to log in with" })
    async authenticationOptions(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Param("id") id: string,
    ): Promise<PublicKeyCredentialRequestOptionsJSON> {
        const instance = await this.initContextAndGetInstance(req, res, id);

        return this.passkeyStrategyService.createAuthenticationOptions(instance, req.context);
    }

    /**
     * Initializes the context, checks both CSRF tokens
     * and resolves the id to a strategy instance of the passkey strategy
     */
    private async initContextAndGetInstance(req: Request, res: Response, id: string): Promise<StrategyInstance> {
        await this.contextInitService.use(req, res);
        await this.authCSRFService.use(req, res);
        req.context.flow.assert();
        await this.flowCSRFService.use(req, res);

        const instance = await this.strategyInstanceService.findOneBy({
            id,
            type: this.passkeyStrategyService.typeName,
        });
        if (!instance) {
            throw new HttpException(`No passkey strategy instance with id ${id}`, HttpStatus.NOT_FOUND);
        }
        return instance;
    }
}

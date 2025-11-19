import { Body, Controller, Get, Logger, Param, Post, Req, Res } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/util/openapi-tag";
import { AuthFunctionInput } from "./types";
import { Request, Response } from "express";
import { OAuthHttpException } from "../errors/OAuthHttpException";
import { LoginUserService } from "../model/services/login-user.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { NoCors } from "../util/NoCors.decorator";
import { DefaultReturn } from "../util/default-return.dto";
import { BaseUserInput } from "../api-login/auth/dto/user-inputs.dto";
import { ContextInitService } from "../backend-services/x-context-init.service";
import { AuthCSRFService } from "../backend-services/x-auth-csrf.service";
import { CodeRedirectService } from "../backend-services/x-code-redirect.service";
import { PromptCallbackService } from "../backend-services/x-prompt-callback.service";
import { StrategiesService } from "../strategies/strategies.service";
import { FlowViaService } from "../backend-services/x-flow-via.service";
import { RegisterCallbackService } from "../backend-services/x-register-callback.service";
import { PromptRedirectService } from "../backend-services/x-prompt-redirect.service";
import { AuthUserService } from "../backend-services/x-auth-user.service";
import { RegisterRedirectService } from "../backend-services/x-register-redirect.service";
import { FlowCSRFService } from "../backend-services/x-flow-csrf.service";
import { ActiveLoginAccessService } from "../model/services/active-login-access.service";
import { FlowStateService } from "../backend-services/x-flow-state.service";
import { FlowState } from "../util/Context";
import { RedirectOnError } from "../errors/redirect-on-error.decorator";
import { LinkCallbackService } from "../backend-services/x-link-callback.service";

@Controller("auth")
@ApiTags(OpenApiTag.INTERNAL_API)
export class AuthEndpointsController {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userService: LoginUserService,
        private readonly authClientService: AuthClientService,
        private readonly contextInitService: ContextInitService,
        private readonly authCSRFService: AuthCSRFService,
        private readonly codeRedirectService: CodeRedirectService,
        private readonly promptCallbackService: PromptCallbackService,
        private readonly strategiesService: StrategiesService,
        private readonly flowViaService: FlowViaService,
        private readonly registerCallbackService: RegisterCallbackService,
        private readonly promptRedirectService: PromptRedirectService,
        private readonly authUserService: AuthUserService,
        private readonly registerRedirectService: RegisterRedirectService,
        private readonly flowCSRFService: FlowCSRFService,
        private readonly activeLoginAccessService: ActiveLoginAccessService,
        private readonly flowStateService: FlowStateService,
        private readonly linkCallbackService: LinkCallbackService,
    ) {}

    /**
     * Authorize endpoint for strategy instance of the given id.
     * Functionality performed is determined by mode parameter.
     */
    @Post("redirect/:id/:mode")
    @NoCors()
    @RedirectOnError()
    @ApiOperation({ summary: "Authorize endpoint for a strategy instance" })
    @ApiParam({ name: "id", type: String, description: "The id of the strategy instance to initiate" })
    @ApiParam({
        name: "mode",
        enum: AuthFunctionInput,
        required: false,
        description: "The function/mode how to authenticate. Defaults to 'login'",
    })
    async loginStrategyRedirect(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Param("id") id: string,
        @Param("mode") mode?: AuthFunctionInput,
    ) {
        /**
         * Init Context and start Link Flow if required
         */
        await this.contextInitService.use(req, res);
        await this.authCSRFService.use(req, res);
        if (req.context.flow.exists()) {
            // Restart Link Flow
            if (req.context.flow.isLinkFlow()) {
                req.context.flow.start();
            } else {
                // Match existing Flow
                await this.flowCSRFService.use(req, res);
                await this.flowStateService.use(FlowState.LOGIN, req, res);
            }
        } else {
            // Start Link Flow
            req.context.flow.start();
        }
        await this.flowViaService.use(req, res);

        /**
         * Strategies
         */
        req.context.flow.setState(FlowState.REDIRECT);
        await this.strategiesService.use(req, res);
    }

    /**
     * Redirect/Callback endpoint for strategy with the given id.
     *
     * Not meant to be called by a client.
     * Meant as callback for oauth flows started by the login-service
     */
    @Get("callback/:id")
    @NoCors()
    @RedirectOnError()
    @ApiOperation({ summary: "Redirect/Callback endpoint for a strategy instance" })
    @ApiParam({
        name: "id",
        description: "The id of the strategy instance which initiated the function calling the callback.",
    })
    async loginStrategyCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        /**
         * Init Context
         */
        await this.contextInitService.use(req, res);
        req.context.flow.assert();
        await this.flowStateService.use(FlowState.REDIRECT, req, res);

        /**
         * Strategies (sets ActiveLogin, checks CSRF, checks Flow)
         */
        await this.strategiesService.use(req, res);

        /**
         * Auth Flow with Login
         */
        if (req.context.flow.isOAuthFlow() && req.context.flow.viaLogin()) {
            /**
             * Authentication
             */
            await this.authUserService.use(req, res);

            /**
             * Consent Prompt
             */
            if (await this.promptRedirectService.if(req, res)) {
                this.logger.log("User did not consent yet, redirecting to consent prompt");
                return this.promptRedirectService.use(req, res);
            }
            this.logger.log("User consented already");

            /**
             * Authorization Code
             */
            this.logger.log("Generating authorization code and redirecting to client");
            return this.codeRedirectService.use(req, res);
        }

        /**
         * Auth Flow with Registration
         */
        if (req.context.flow.isOAuthFlow() && req.context.flow.viaRegister()) {
            /**
             * Register Redirect
             */
            return this.registerRedirectService.use(req, res);
        }

        /**
         * Link Flow
         */
        if (req.context.flow.isLinkFlow()) {
            /**
             * Link Account to User
             */
            return this.linkCallbackService.use(req, res);
        }

        throw new Error("Endpoint is called in a wrong context");
    }

    @Post("submit/:id/:mode")
    @NoCors()
    @RedirectOnError()
    @ApiOperation({ summary: "Submit endpoint for a strategy instance" })
    @ApiParam({ name: "id", type: String, description: "The id of the strategy instance to submit" })
    @ApiParam({
        name: "mode",
        enum: AuthFunctionInput,
        required: false,
        description: "The function/mode how to authenticate. Defaults to 'login'",
    })
    async loginStrategySubmit(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        /**
         * Init Context and start Link Flow if required
         */
        await this.contextInitService.use(req, res);
        await this.authCSRFService.use(req, res);
        if (req.context.flow.exists()) {
            // Restart Link Flow
            if (req.context.flow.isLinkFlow()) {
                req.context.flow.start();
            } else {
                // Match existing Flow
                await this.flowCSRFService.use(req, res);
                await this.flowStateService.use(FlowState.LOGIN, req, res);
            }
        } else {
            // Create new Link Flow
            req.context.flow.start();
        }
        await this.flowViaService.use(req, res);

        /**
         * Strategies (sets ActiveLogin)
         */
        await this.strategiesService.use(req, res);

        /**
         * Auth Flow with Login
         */
        if (req.context.flow.isOAuthFlow() && req.context.flow.viaLogin()) {
            /**
             * Authentication
             */
            await this.authUserService.use(req, res);

            /**
             * Consent Prompt
             */
            if (await this.promptRedirectService.if(req, res)) {
                this.logger.log("User did not consent yet, redirecting to consent prompt");
                return this.promptRedirectService.use(req, res);
            }
            this.logger.log("User consented already");

            /**
             * Authorization Code
             */
            this.logger.log("Generating authorization code and redirecting to client");
            return this.codeRedirectService.use(req, res);
        }

        /**
         * Auth Flow with Registration
         */
        if (req.context.flow.isOAuthFlow() && req.context.flow.viaRegister()) {
            /**
             * Register Redirect
             */
            return this.registerRedirectService.use(req, res);
        }

        /**
         * Link Flow
         */
        if (req.context.flow.isLinkFlow()) {
            /**
             * Link Account to User
             */
            return this.linkCallbackService.use(req, res);
        }

        throw new Error("Endpoint is called in a wrong context");
    }

    @Get("csrf")
    @NoCors()
    @ApiOperation({ summary: "Endpoint to access the session-bound CSRF token" })
    async csrfToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{
        csrf: string;
    }> {
        await this.contextInitService.use(req, res);

        return {
            csrf: req.context.auth.getCSRF(),
        };
    }

    @Get("flow")
    @NoCors()
    @ApiOperation({ summary: "Endpoint to access the flow-bound CSRF token" })
    async flowData(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{
        id?: string;
    }> {
        await this.contextInitService.use(req, res);

        return {
            id: req.context.flow.tryId(),
        };
    }

    @Get("prompt/data")
    @NoCors()
    @ApiOperation({ summary: "Endpoint to access data that should be displayed to the user" })
    async promptData(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{
        userId: string;
        username: string;
        flow: string;
        redirect: string;
        scope: string[];
        clientId: string;
        clientName: string;
    }> {
        /**
         * Init Context
         */
        await this.contextInitService.use(req, res);
        req.context.flow.assert();
        if (!req.context.auth.isAuthenticated()) {
            throw new OAuthHttpException("access_denied", "The user is not authenticated");
        }

        /**
         * Response
         */
        const request = req.context.flow.getRequest();
        const user = await this.userService.findOneByOrFail({ id: req.context.auth.getUserId() });
        const client = await this.authClientService.findAuthClient(request.clientId);
        return {
            userId: req.context.auth.getUserId(),
            username: user.username,
            flow: req.context.flow.getId(),
            redirect: request.redirect,
            scope: request.scope,
            clientId: request.clientId,
            clientName: client.name,
        };
    }

    @Post("prompt/callback")
    @NoCors()
    @RedirectOnError()
    @ApiOperation({ summary: "Callback endpoint for granting permissions" })
    async promptCallback(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Body() flow: string,
        @Body() consent: boolean,
    ) {
        /**
         * Init Context
         */
        await this.contextInitService.use(req, res);
        await this.authCSRFService.use(req, res);
        req.context.flow.assert();
        await this.flowCSRFService.use(req, res);
        await this.flowStateService.use(FlowState.PROMPT, req, res);
        if (!req.context.auth.isAuthenticated()) throw new Error("User not authenticated");
        if (!req.context.flow.tryActiveLoginId()) throw new Error("No active login id in flow");

        /**
         * Prompt Callback
         */
        await this.promptCallbackService.use(req, res);

        /**
         * Authorization Code
         */
        await this.codeRedirectService.use(req, res);
    }

    @Post("register/callback")
    @NoCors()
    @RedirectOnError()
    @ApiOperation({ summary: "Complete a registration" })
    async register(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() input: BaseUserInput) {
        /**
         * Init Context
         */
        await this.contextInitService.use(req, res);
        await this.authCSRFService.use(req, res);
        req.context.flow.assert();
        await this.flowCSRFService.use(req, res);
        await this.flowStateService.use(FlowState.REGISTER, req, res);

        /**
         * Registration Callback (also links account in Link Flow)
         */
        await this.registerCallbackService.use(req, res);

        /**
         * Auth Flow with Registration
         */
        if (req.context.flow.isOAuthFlow() && req.context.flow.viaRegister()) {
            /**
             * Authentication
             */
            await this.authUserService.use(req, res);

            /**
             * Consent Prompt
             */
            if (await this.promptRedirectService.if(req, res)) {
                this.logger.log("User did not consent yet, redirecting to consent prompt");
                return this.promptRedirectService.use(req, res);
            }
            this.logger.log("User consented already");

            /**
             * Authorization Code
             */
            this.logger.log("Generating authorization code and redirecting to client");
            return this.codeRedirectService.use(req, res);
        }

        throw new Error("Endpoint is called in a wrong context");
    }

    @Post("logout/current")
    @NoCors()
    @ApiOperation({ summary: "Logout current session" })
    async logoutCurrent(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        await this.contextInitService.use(req, res);
        await this.authCSRFService.use(req, res);

        await this.activeLoginAccessService.deleteByActiveLoginId(req.context.auth.getActiveLoginId());

        req.context.regenerate();
        return new DefaultReturn("logout/current");
    }

    @Post("logout/everywhere")
    @NoCors()
    @ApiOperation({ summary: "Logout everywhere" })
    async logoutEverywhere(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        await this.contextInitService.use(req, res);
        await this.authCSRFService.use(req, res);

        const user = await this.userService.findOneByOrFail({ id: req.context.auth.getUserId() });
        if (!user) throw new Error("Did not found user");
        user.revokeTokensBefore = new Date();
        await this.userService.save(user);

        await this.activeLoginAccessService.deleteByUserId(user.id);

        req.context.regenerate();
        return new DefaultReturn("logout/everywhere");
    }
}

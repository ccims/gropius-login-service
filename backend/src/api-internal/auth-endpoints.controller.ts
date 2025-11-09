import { Body, Controller, Get, Logger, Param, Post, Req, Res } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/util/openapi-tag";
import { AuthFunctionInput } from "./types";
import { Request, Response } from "express";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import { LoginUserService } from "../model/services/login-user.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { NoCors } from "../util/NoCors.decorator";
import { DefaultReturn } from "../util/default-return.dto";
import { BaseUserInput } from "../api-login/auth/dto/user-inputs.dto";
import { ActiveLoginService } from "../model/services/active-login.service";
import { ContextInitService } from "../backend-services/x-context-init.service";
import { CSRFService } from "../backend-services/x-csrf.service";
import { CodeRedirectService } from "../backend-services/x-code-redirect.service";
import { PromptCallbackService } from "../backend-services/x-prompt-callback.service";
import { StrategiesService } from "../strategies/strategies.service";
import { FlowViaService } from "../backend-services/x-flow-via.service";
import { RegisterCallbackService } from "../backend-services/x-register-callback.service";
import { PromptRedirectService } from "../backend-services/x-prompt-redirect.service";
import { AuthUserService } from "../backend-services/x-auth-user.service";
import { RegisterRedirectService } from "../backend-services/x-register-redirect.service";
import { FlowMatchService } from "../backend-services/x-flow-match.service";
import { ActiveLoginAccessService } from "../model/services/active-login-access.service";
import { FlowStateService } from "../backend-services/x-flow-state.service";
import { FlowState } from "../util/Context";

/**
 * Controller for the openapi generator to find the oauth server routes that are handled exclusively in middleware.
 *
 * This includes:
 * - Authorize endpoint
 * - Redirect/Callback endpoint
 */
@Controller("auth")
@ApiTags(OpenApiTag.INTERNAL_API)
export class AuthEndpointsController {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userService: LoginUserService,
        private readonly authClientService: AuthClientService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly contextInitService: ContextInitService,
        private readonly csrfService: CSRFService,
        private readonly codeRedirectService: CodeRedirectService,
        private readonly promptCallbackService: PromptCallbackService,
        private readonly strategiesService: StrategiesService,
        private readonly flowViaService: FlowViaService,
        private readonly registerCallbackService: RegisterCallbackService,
        private readonly codeService: CodeRedirectService,
        private readonly promptRedirectService: PromptRedirectService,
        private readonly authUserService: AuthUserService,
        private readonly registerRedirectService: RegisterRedirectService,
        private readonly flowMatchService: FlowMatchService,
        private readonly activeLoginAccessService: ActiveLoginAccessService,
        private readonly flowStateService: FlowStateService,
    ) {}

    /**
     * Authorize endpoint for strategy instance of the given id.
     * Functionality performed is determined by mode parameter.
     *
     * For defined behaviour of the authorize endpoint see {@link https://www.rfc-editor.org/rfc/rfc6749}
     *
     */
    @Post("redirect/:id/:mode")
    @NoCors()
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
        await this.csrfService.use(req, res);
        if (req.context.flow.exists()) {
            // Restart Link Flow
            if (req.context.flow.isLinkFlow()) {
                req.context.flow.drop();
                req.context.flow.init();
            } else {
                // Match existing Flow
                await this.flowMatchService.use(req, res);
                await this.flowStateService.use(FlowState.LOGIN, req, res);
            }
        } else {
            // Start Link Flow
            req.context.flow.init();
        }
        await this.flowViaService.use(req, res);

        /**
         * Strategies
         */
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
        if (req.context.flow.isAuthFlow() && req.context.flow.viaLogin()) {
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
            return this.codeService.use(req, res);
        }

        /**
         * Auth Flow with Registration
         */
        if (req.context.flow.isAuthFlow() && req.context.flow.viaRegister()) {
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
             * Register Redirect
             */
            return this.registerRedirectService.use(req, res);
        }

        throw new Error("Endpoint is called in a wrong context");
    }

    @Post("submit/:id/:mode")
    @NoCors()
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
        await this.csrfService.use(req, res);
        if (req.context.flow.exists()) {
            // Restart Link Flow
            if (req.context.flow.isLinkFlow()) {
                req.context.flow.drop();
                req.context.flow.init();
            } else {
                // Match existing Flow
                await this.flowMatchService.use(req, res);
                await this.flowStateService.use(FlowState.LOGIN, req, res);
            }
        } else {
            // Create new Link Flow
            req.context.flow.init();
        }
        await this.flowViaService.use(req, res);

        /**
         * Strategies (sets ActiveLogin)
         */
        await this.strategiesService.use(req, res);

        /**
         * Auth Flow with Login
         */
        if (req.context.flow.isAuthFlow() && req.context.flow.viaLogin()) {
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
            return this.codeService.use(req, res);
        }

        /**
         * Auth Flow with Registration
         */
        if (req.context.flow.isAuthFlow() && req.context.flow.viaRegister()) {
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
             * Register Redirect
             */
            return this.registerRedirectService.use(req, res);
        }

        throw new Error("Endpoint is called in a wrong context");
    }

    @Get("csrf")
    @NoCors()
    @ApiOperation({ summary: "Endpoint to access the CSRF token" })
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
    @ApiOperation({ summary: "Endpoint to access the flow data" })
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
        await this.contextInitService.use(req, res);
        req.context.flow.assert();

        if (!req.context.auth.isAuthenticated()) {
            throw new OAuthHttpException("access_denied", "The user is not authenticated");
        }

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
        await this.csrfService.use(req, res);
        req.context.flow.assert();
        await this.flowMatchService.use(req, res);
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
    @ApiOperation({ summary: "Complete a registration" })
    async register(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() input: BaseUserInput) {
        /**
         * Init Context
         */
        await this.contextInitService.use(req, res);
        await this.csrfService.use(req, res);
        req.context.flow.assert();
        await this.flowMatchService.use(req, res);
        await this.flowStateService.use(FlowState.REGISTER, req, res);

        /**
         * Registration Callback
         */
        await this.registerCallbackService.use(req, res);

        /**
         * Link Flow
         */
        if (req.context.flow.isLinkFlow()) {
            req.context.flow.drop();
            return res.redirect(`/auth/flow/account`);
        }

        /**
         * Auth Flow with Registration
         */
        if (req.context.flow.isAuthFlow() && req.context.flow.viaRegister()) {
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
            return this.codeService.use(req, res);
        }

        throw new Error("Endpoint is called in a wrong context");
    }

    @Post("logout/current")
    @NoCors()
    @ApiOperation({ summary: "Logout current session" })
    async logoutCurrent(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        await this.contextInitService.use(req, res);
        await this.csrfService.use(req, res);

        await this.activeLoginAccessService.deleteByActiveLoginId(req.context.auth.getActiveLoginId());

        req.context.regenerate();
        return new DefaultReturn("logout/current");
    }

    @Post("logout/everywhere")
    @NoCors()
    @ApiOperation({ summary: "Logout everywhere" })
    async logoutEverywhere(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        await this.contextInitService.use(req, res);
        await this.csrfService.use(req, res);

        const user = await this.userService.findOneByOrFail({ id: req.context.auth.getUserId() });
        if (!user) throw new Error("Did not found user");
        user.revokeTokensBefore = new Date();
        await this.userService.save(user);

        await this.activeLoginAccessService.deleteByUserId(user.id);

        req.context.regenerate();
        return new DefaultReturn("logout/everywhere");
    }
}

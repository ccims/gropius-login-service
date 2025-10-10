import { Controller, Get, Logger, Req, Res } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/util/openapi-tag";
import { NoCors } from "../util/NoCors.decorator";
import { Request, Response } from "express";
import { AuthClientService } from "../model/services/auth-client.service";
import { combineURL } from "../util/utils";
import { FlowInitService } from "../backend-services/x-flow-init.service";
import { CodeRedirectService } from "../backend-services/x-code-redirect.service";
import { PromptRedirectService } from "../backend-services/x-prompt-redirect.service";
import { RequestExtractService } from "../backend-services/x-request-extract.service";
import { LoginRedirectService } from "../backend-services/x-login-redirect.service";

/**
 * Controller for the openapi generator to find the oauth server routes that are handled exclusively in middleware.
 *
 * This includes:
 * - Authorize endpoint
 * - Redirect/Callback endpoint
 */
@Controller()
export class AuthorizeController {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly flowInitService: FlowInitService,
        private readonly authClientService: AuthClientService,
        private readonly codeService: CodeRedirectService,
        private readonly promptRedirectService: PromptRedirectService,
        private readonly requestExtractService: RequestExtractService,
        private readonly loginRedirectService: LoginRedirectService,
    ) {}

    /**
     * Authorize endpoint for strategy instance of the given id.
     * Functionality performed is determined by mode parameter.
     *
     * For defined behaviour of the authorize endpoint see {@link https://www.rfc-editor.org/rfc/rfc6749}
     *
     */
    @Get("authorize")
    @NoCors()
    @ApiOperation({ summary: "Authorize OAuth endpoint" })
    @ApiQuery({ name: "client_id", type: String, description: "The id of the client to initiate" })
    @ApiQuery({
        name: "response_type",
        required: true,
        description: "The response type to expect.",
    })
    @ApiQuery({
        name: "redirect_uri",
        required: true,
        description: "The redirect uri to use. Must be one of the registered redirect uris of the client",
    })
    @ApiQuery({
        name: "state",
        required: false,
        description: "The state to pass through the oauth flow",
    })
    @ApiQuery({
        name: "scope",
        required: true,
        description: "The scope to request",
    })
    @ApiQuery({
        name: "code_challenge",
        required: true,
        description: "The code challenge to use for PKCE",
    })
    @ApiQuery({
        name: "code_challenge_method",
        required: true,
        description: "The code challenge method to use for PKCE, only S256 is supported",
    })
    @ApiTags(OpenApiTag.OAUTH_API)
    async authorizeEndpoint(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        this.logger.log("Staring new authorize request");

        /**
         * Init flow
         */
        await this.flowInitService.use(req, res);

        /**
         * Request
         */
        const request = await this.requestExtractService.use(req, res);
        req.context.flow.init();
        req.context.flow.setRequest(request);

        /**
         * Authentication
         */
        if (!req.context.auth.isAuthenticated()) {
            this.logger.log("User not authenticated, redirecting to login");
            return this.loginRedirectService.use(req, res);
        }
        this.logger.log("User is authenticated");

        /**
         * Consent Prompt
         */
        const client = await this.authClientService.findAuthClient(request.clientId);
        if (!(client.isInternal || req.context.flow.didConsent())) {
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
}

import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/util/openapi-tag";
import { AuthFunctionInput } from "./dto/auth-function.dto";
import { Request, Response } from "express";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import { LoginUserService } from "../model/services/login-user.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { NoCors } from "../util/NoCors.decorator";
import { DefaultReturn } from "../util/default-return.dto";
import { BaseUserInput } from "../api-login/auth/dto/user-inputs.dto";
import { ActiveLoginService } from "../model/services/active-login.service";
import { FlowInitService } from "../backend-services/x-flow-init.service";
import { CSRFService } from "../backend-services/x-csrf.service";

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
    constructor(
        private readonly userService: LoginUserService,
        private readonly authClientService: AuthClientService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly flowInitService: FlowInitService,
        private readonly csrfService: CSRFService,
    ) {}

    /**
     * Authorize endpoint for strategy instance of the given id.
     * Functionality performed is determined by mode parameter.
     *
     * For defined behaviour of the authorize endpoint see {@link https://www.rfc-editor.org/rfc/rfc6749}
     *
     */
    @Get("redirect/:id/:mode")
    @NoCors()
    @ApiOperation({ summary: "Authorize endpoint for a strategy instance" })
    @ApiParam({ name: "id", type: String, description: "The id of the strategy instance to initiate" })
    @ApiParam({
        name: "mode",
        enum: AuthFunctionInput,
        required: false,
        description: "The function/mode how to authenticate. Defaults to 'login'",
    })
    loginStrategyRedirect(@Param("id") id: string, @Param("mode") mode?: AuthFunctionInput) {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
        description: "The id of the strategy instance which initiated the funcation calling the callback.",
    })
    loginStrategyCallback() {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    @Get("submit/:id/:mode")
    @NoCors()
    @ApiOperation({ summary: "Submit endpoint for a strategy instance" })
    @ApiParam({ name: "id", type: String, description: "The id of the strategy instance to submit" })
    @ApiParam({
        name: "mode",
        enum: AuthFunctionInput,
        required: false,
        description: "The function/mode how to authenticate. Defaults to 'login'",
    })
    loginStrategySubmit() {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
        await this.flowInitService.use(req, res);

        return {
            csrf: req.context.auth.getCSRF(),
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
        await this.flowInitService.use(req, res);

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
    promptCallback(@Body() flow: string, @Body() consent: boolean) {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    @Post("register/callback")
    @NoCors()
    @ApiOperation({ summary: "Complete a registration" })
    register(@Body() input: BaseUserInput) {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    @Post("logout/current")
    @NoCors()
    @ApiOperation({ summary: "Logout current session" })
    async logoutCurrent(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        await this.flowInitService.use(req, res);
        await this.csrfService.use(req, res);

        req.context.regenerate();
        return new DefaultReturn("logout/current");
    }

    @Post("logout/everywhere")
    @NoCors()
    @ApiOperation({ summary: "Logout everywhere" })
    async logoutEverywhere(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        await this.flowInitService.use(req, res);
        await this.csrfService.use(req, res);

        const user = await this.userService.findOneByOrFail({ id: req.context.auth.getUserId() });
        if (!user) throw new Error("Did not found user");
        user.revokeTokensBefore = new Date();
        await this.userService.save(user);

        await this.activeLoginService.deleteForUser(user);

        req.context.regenerate();
        return new DefaultReturn("logout/everywhere");
    }
}

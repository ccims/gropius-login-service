import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/openapi-tag";
import { AuthFunctionInput } from "./dto/auth-function.dto";
import { SelfRegisterUserInput } from "./dto/self-register-user-input.dto";
import { Request } from "express";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import { LoginUserService } from "../model/services/login-user.service";
import { AuthClientService } from "../model/services/auth-client.service";

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
    ) {}

    /**
     * Authorize endpoint for strategy instance of the given id.
     * Functionality performed is determined by mode parameter.
     *
     * For defined behaviour of the authorize endpoint see {@link https://www.rfc-editor.org/rfc/rfc6749}
     *
     */
    @Get("redirect/:id/:mode")
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

    @Get("prompt/data")
    @ApiOperation({ summary: "Endpoint to access data that should be displayed to the user" })
    async promptData(@Req() req: Request): Promise<{
        userId: string;
        username: string;
        flow: string;
        redirect: string;
        scope: string[];
        clientId: string;
        clientName: string;
    }> {
        if (!req.flow.isAuthenticated()) {
            throw new OAuthHttpException("access_denied", "The user is not authenticated");
        }

        const request = req.flow.getRequest();
        const user = await this.userService.findOneBy({ id: req.flow.getUser() });
        const client = await this.authClientService.findAuthClient(request.clientId);

        return {
            userId: req.flow.getUser(),
            username: user.username,
            flow: req.flow.getFlow(),
            redirect: request.redirect,
            scope: request.scope,
            clientId: request.clientId,
            clientName: client.name,
        };
    }

    @Post("prompt/callback")
    @ApiOperation({ summary: "Callback endpoint for granting permissions" })
    promptCallback(@Body() flow: string, @Body() consent: boolean) {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    @Post("register")
    @ApiOperation({ summary: "Complete a registration" })
    register(@Body() input: SelfRegisterUserInput) {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

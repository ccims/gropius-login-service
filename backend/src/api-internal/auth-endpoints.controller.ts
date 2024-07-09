import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/openapi-tag";
import { AuthFunctionInput } from "./dto/auth-function.dto";
import { SelfRegisterUserInput } from "src/api-login/dto/user-inputs.dto";

/**
 * Controller for the openapi generator to find the oauth server routes that are handeled exclusively in middleware.
 *
 * This includes:
 * - Authorize endpoint
 * - Redirect/Callback endpoint
 */
@Controller("auth")
export class AuthEndpointsController {
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
    @ApiTags(OpenApiTag.INTERNAL_API)
    authorizeEndpoint(@Param("id") id: string, @Param("mode") mode?: AuthFunctionInput) {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handeled in middleware",
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
    @ApiTags(OpenApiTag.INTERNAL_API)
    redirectEndpoint() {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handeled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    @Post("submit/:id/:mode")
    @ApiOperation({ summary: "Submit endpoint for a strategy instance" })
    @ApiParam({ name: "id", type: String, description: "The id of the strategy instance to submit" })
    @ApiParam({
        name: "mode",
        enum: AuthFunctionInput,
        required: false,
        description: "The function/mode how to authenticate. Defaults to 'login'",
    })
    @ApiTags(OpenApiTag.INTERNAL_API)
    submitEndpoint() {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handeled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    @Post("register")
    @ApiOperation({ summary: "Copmplete a registration" })
    @ApiTags(OpenApiTag.INTERNAL_API)
    registerEndpoint(@Body() input: SelfRegisterUserInput) {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handeled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

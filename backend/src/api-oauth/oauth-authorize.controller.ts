import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/openapi-tag";
import { NoCors } from "../api-internal/no-cors.decorator";

/**
 * Controller for the openapi generator to find the oauth server routes that are handled exclusively in middleware.
 *
 * This includes:
 * - Authorize endpoint
 * - Redirect/Callback endpoint
 */
@Controller()
export class OauthAuthorizeController {
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
    authorizeEndpoint() {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

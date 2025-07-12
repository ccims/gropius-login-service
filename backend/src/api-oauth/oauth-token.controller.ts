import { Controller, HttpException, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/openapi-tag";
import { OAuthTokenResponseDto } from "./dto/oauth-token-response.dto";
import { CatchOAuthError } from "./catch-oauth-error.decorator";

@Controller()
@ApiTags(OpenApiTag.OAUTH_API)
export class OAuthTokenController {
    @Post("token")
    @CatchOAuthError()
    @ApiOperation({ summary: "Token OAuth Endpoint" })
    @ApiOkResponse({ type: OAuthTokenResponseDto })
    async token(): Promise<OAuthTokenResponseDto> {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

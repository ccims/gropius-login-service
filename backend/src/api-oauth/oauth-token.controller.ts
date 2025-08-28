import { Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/util/openapi-tag";
import { OauthTokenResponse } from "./dto/oauth-token-response.dto";

@Controller()
@ApiTags(OpenApiTag.OAUTH_API)
export class OAuthTokenController {
    @Post("token")
    @ApiOperation({ summary: "Token OAuth Endpoint" })
    @ApiOkResponse({ type: OauthTokenResponse })
    async token(): Promise<OauthTokenResponse> {
        throw new HttpException(
            "This controller shouldn't be reached as all functionality is handled in middleware",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

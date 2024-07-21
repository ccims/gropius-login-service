import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { CheckAccessTokenGuard } from "src/util/CheckAccessTokenGuard";

/**
 * Guard for checking the presence of an access token in the request.
 * If needed, checks for admin permissions of the user.
 *
 * Used with `@UseGuards(CheckLoginServiceAccessTokenGuard)`
 *
 * The access token is expected in the "Authorization" header, prefixed with "Bearer ".
 * Not providing a token, a token without prefix or an invalid token will result in a 401 Unauthorized response.
 *
 * Once access token (and admin permission) were verified sucessfully,
 * the logged in user is written to the request state object
 */
@Injectable()
export class CheckLoginServiceAccessTokenGuard extends CheckAccessTokenGuard {
    constructor(tokenService: TokenService, reflector: Reflector, backendUserService: BackendUserService) {
        super(tokenService, reflector, backendUserService, TokenScope.LOGIN_SERVICE);
    }
}

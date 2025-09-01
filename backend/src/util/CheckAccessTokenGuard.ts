import { CanActivate, ExecutionContext, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { TokenScope, TokenService } from "src/backend-services/token.service";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { ApiStateData } from "./ApiStateData";

/**
 * Base class for guards for checking the presence of an access token in the request.
 * If needed, checks for admin permissions of the user.
 * Required scope can be configured using the requiredScope property.
 *
 * The access token is expected in the "Authorization" header, prefixed with "Bearer ".
 * Not providing a token, a token without prefix or an invalid token will result in a 401 Unauthorized response.
 *
 * Once access token (and admin permission) were verified sucessfully,
 * the logged in user is written to the request state object
 */
export class CheckAccessTokenGuard implements CanActivate {
    private readonly logger = new Logger(CheckAccessTokenGuard.name);
    constructor(
        private readonly tokenService: TokenService,
        private readonly reflector: Reflector,
        private readonly backendUserService: BackendUserService,
        private readonly requiredScope: TokenScope,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const authHead = req?.headers?.authorization;
        if (!authHead || authHead.length == 0) {
            throw new UnauthorizedException(undefined, "Authorization header is empty");
        }
        if (!authHead.toLowerCase().startsWith("bearer ")) {
            throw new UnauthorizedException(undefined, "Only accepting Bearer authorization");
        }
        const token = authHead.substring(7).trim();
        let user: LoginUser;
        try {
            user = (await this.tokenService.verifyAccessToken(token, this.requiredScope)).user;
        } catch (err: any) {
            this.logger.warn("Invalid access token:", err);
            throw new UnauthorizedException(undefined, "Invalid access token: " + (err.message ?? err));
        }
        if (!user) {
            this.logger.warn("No user based on token");
            return false;
        }

        const needsAdmin = this.reflector.get<boolean>("needsAdmin", context.getHandler()) ?? false;
        if (needsAdmin) {
            this.logger.debug("Current request needs admin, quering backend");
            const isAdmin = await this.backendUserService.checkIsUserAdmin(user);
            if (!isAdmin) {
                return false;
            }
        }

        const res = context.switchToHttp().getResponse<Response>();
        (res.locals.state as ApiStateData).loggedInUser = user;
        return true;
    }
}

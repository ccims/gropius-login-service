import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { compareTimeSafe } from "../util/utils.js";

/**
 * Guard requiring the sync API secret as bearer token.
 *
 * A missing secret must lock this API down rather than open it up: it hands out IMS access
 * tokens, so an unconfigured secret can never mean "no secret required".
 */
@Injectable()
export class CheckSyncSecretGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const expectedToken = process.env.GROPIUS_LOGIN_SYNC_API_SECRET?.trim();
        if (!expectedToken || expectedToken.length == 0) {
            throw new UnauthorizedException(undefined, "Sync API secret is not configured");
        }

        const authHead = context.switchToHttp().getRequest<Request>()?.headers?.authorization;
        if (!authHead || authHead.length == 0) {
            throw new UnauthorizedException(undefined, "Authorization header is empty");
        }
        if (!authHead.toLowerCase().startsWith("bearer ")) {
            throw new UnauthorizedException(undefined, "Only accepting Bearer authorization");
        }
        const token = authHead.substring(7).trim();

        if (!compareTimeSafe(token, expectedToken)) {
            throw new UnauthorizedException(undefined, "Invalid sync-api secret");
        }
        return true;
    }
}

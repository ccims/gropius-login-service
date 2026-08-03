import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { compareTimeSafe } from "../util/utils.js";

@Injectable()
export class CheckSyncSecretGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const expectedToken = process.env.GROPIUS_LOGIN_SYNC_API_SECRET?.trim();
        // Never fall back to "no secret configured means no secret required": this API hands out
        // IMS access tokens, so a missing secret must lock the API down rather than open it up.
        // The configuration validator additionally rejects an empty value at startup.
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

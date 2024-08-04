import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class CheckSyncSecretGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const expectedToken = process.env.GROPIUS_LOGIN_SYNC_API_SECRET?.trim();
        if (!expectedToken || expectedToken.length == 0) {
            return true;
        }

        const authHead = context.switchToHttp().getRequest<Request>()?.headers?.authorization;
        if (!authHead || authHead.length == 0) {
            throw new UnauthorizedException(undefined, "Authorization header is empty");
        }
        if (!authHead.toLowerCase().startsWith("bearer ")) {
            throw new UnauthorizedException(undefined, "Only accepting Bearer authorization");
        }
        const token = authHead.substring(7).trim();

        if (token != expectedToken) {
            throw new UnauthorizedException(undefined, "Invalid sync-api secret");
        }
        return true;
    }
}

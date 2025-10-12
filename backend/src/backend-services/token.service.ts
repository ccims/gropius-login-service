import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash } from "crypto";
import { JsonWebTokenError } from "jsonwebtoken";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { LoginUserService } from "src/model/services/login-user.service";
import { AuthClientService } from "../model/services/auth-client.service";

export interface ActiveLoginTokenResult {
    activeLoginId: string;
    clientId: string;
    tokenUniqueId: string;
    scope: TokenScope[];
    codeChallenge?: string;
}

export enum TokenScope {
    LOGIN_SERVICE = "login",
    LOGIN_SERVICE_REGISTER = "login-register",
    BACKEND = "backend",
    AUTH = "auth",
}

enum RefreshTokenScope {
    REFRESH_TOKEN = "token",
}

// TODO: cleanup

@Injectable()
export class TokenService {
    constructor(
        @Inject("BackendJwtService")
        private readonly backendJwtService: JwtService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly loginUserService: LoginUserService,
    ) {}

    async signAccessToken(user: LoginUser, scope: string[], expiresIn?: number): Promise<string> {
        const expiryObject = !!expiresIn ? { expiresIn: Math.floor(expiresIn / 1000) } : {};
        this.verifyScope(scope);
        if (scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)) {
            throw new Error("Cannot sign access token with register scope");
        }
        if (!user.neo4jId) {
            throw new Error("Login user without neo4jId: " + user.id);
        }
        return this.backendJwtService.sign(
            {
                kind: "access_token",
            },
            {
                subject: user.neo4jId,
                ...expiryObject,
                audience: scope,
            },
        );
    }

    async signRegistrationToken(activeLoginId: string, expiresIn?: number): Promise<string> {
        const expiryObject = !!expiresIn ? { expiresIn: Math.floor(expiresIn / 1000) } : {};
        return this.backendJwtService.signAsync(
            {},
            {
                subject: activeLoginId,
                ...expiryObject,
                audience: [TokenScope.LOGIN_SERVICE_REGISTER],
            },
        );
    }

    async signAuthorizationCode(
        activeLoginId: string,
        clientId: string,
        scope: TokenScope[],
        codeChallenge: string,
    ): Promise<string> {
        this.verifyScope(scope);

        const activeLogin = await this.activeLoginService.findOneByOrFail({
            id: activeLoginId,
        });

        if (!activeLogin.isValid) {
            throw new Error("Active login invalid");
        }

        if (activeLogin.isExpired) {
            throw new Error("Active login expired");
        }

        const expiresIn = Math.floor(parseInt(process.env.GROPIUS_OAUTH_CODE_EXPIRATION_TIME_MS, 10) / 1000);

        return await this.backendJwtService.signAsync(
            {
                client_id: clientId,
                scope,
                code_challenge: codeChallenge,
                kind: "authorization_code",
            },
            {
                subject: activeLoginId,
                expiresIn: expiresIn,
                audience: process.env.GROPIUS_JWT_ISSUER,
            },
        );
    }

    async verifyAuthorizationCode(token: string, requiredClientId: string): Promise<ActiveLoginTokenResult> {
        const payload = await this.backendJwtService.verifyAsync(token, {
            audience: process.env.GROPIUS_JWT_ISSUER,
        });

        if (payload.kind !== "authorization_code") {
            throw new JsonWebTokenError("Token is not an authorization code");
        }

        if (payload.client_id !== requiredClientId) {
            throw new JsonWebTokenError("Token is not for current client");
        }

        if (!payload.sub) {
            throw new JsonWebTokenError("Active login token (code) doesn't contain an id");
        }

        return {
            activeLoginId: payload.sub,
            clientId: payload.client_id,
            // TODO: omit this?
            tokenUniqueId: payload.jti,
            scope: payload.scope,
            codeChallenge: payload.code_challenge,
        };
    }

    // TODO: rewrite for RefreshToken
    async signRefreshToken(
        activeLoginId: string,
        clientId: string,
        uniqueId: string | number,
        scope: TokenScope[],
        expiresInAt: number | Date | undefined,
    ): Promise<string> {
        this.verifyScope(scope);
        const expiresInObject = typeof expiresInAt == "number" ? { expiresIn: expiresInAt / 1000 } : {};
        const expiresAtObject =
            typeof expiresInAt == "object" && expiresInAt instanceof Date
                ? { exp: Math.floor(expiresInAt.getTime() / 1000) }
                : {};
        return await this.backendJwtService.signAsync(
            {
                ...expiresAtObject,
                client_id: clientId,
                scope,
                kind: "refresh_token",
            },
            {
                subject: activeLoginId,
                ...expiresInObject,
                jwtid: uniqueId.toString(),
                audience: [RefreshTokenScope.REFRESH_TOKEN],
            },
        );
    }

    async verifyAccessToken(token: string, scope: TokenScope): Promise<{ user: LoginUser | null }> {
        const payload = await this.backendJwtService.verifyAsync(token, {
            audience: [scope],
        });

        if (payload.kind !== "access_token") {
            throw new JsonWebTokenError("Token is not an access token");
        }

        const audience: string[] = payload.aud as string[];
        let user: LoginUser | null = null;
        if (!audience.includes(TokenScope.LOGIN_SERVICE_REGISTER)) {
            user = await this.loginUserService.findOneBy({
                neo4jId: payload.sub,
            });
        } else {
            user = await this.loginUserService.findOneBy({ id: payload.sub });
        }
        const tokenIssuedAt = payload.iat as number;
        const revokeBefore = user?.revokeTokensBefore.getTime();
        if (revokeBefore !== undefined && Math.floor(revokeBefore / 1000) > tokenIssuedAt) {
            throw new Error("Token invalid");
        }
        user = user ?? null;
        return { user };
    }

    // TODO: rewrite for RefreshToken
    async verifyRefreshToken(token: string, requiredClientId: string): Promise<ActiveLoginTokenResult> {
        const payload = await this.backendJwtService.verifyAsync(token, {
            audience: [RefreshTokenScope.REFRESH_TOKEN],
        });

        if (payload.kind !== "refresh_token") {
            throw new JsonWebTokenError("Token is not an refresh token");
        }

        if (payload.client_id !== requiredClientId) {
            throw new JsonWebTokenError("Token is not for current client");
        }

        if (!payload.sub) {
            throw new JsonWebTokenError("Active login token (code) doesn't contain an id");
        }

        return {
            activeLoginId: payload.sub,
            clientId: payload.client_id,
            tokenUniqueId: payload.jti,
            scope: payload.scope,
            codeChallenge: payload.code_challenge,
        };
    }

    calculateCodeChallenge(codeVerifier: string): string {
        return createHash("sha256")
            .update(codeVerifier)
            .digest("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
    }

    /**
     * Verifies that the given combination of scopes is valid.
     *
     * @param scopes the scopes to verify
     */
    verifyScope(scopes: string[]) {
        const validScopes: string[] = Object.values(TokenScope);
        for (const scope of scopes) {
            if (!validScopes.includes(scope)) {
                throw new JsonWebTokenError("Invalid scope: " + scope);
            }
        }
        if (scopes.length === 0) {
            throw new JsonWebTokenError("No scope given");
        }
        if (scopes.includes(TokenScope.LOGIN_SERVICE_REGISTER) && scopes.length > 1) {
            throw new JsonWebTokenError("Register scope must be the only scope");
        }
    }
}

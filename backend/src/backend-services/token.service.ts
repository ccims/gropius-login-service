import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash } from "crypto";
import { JsonWebTokenError } from "jsonwebtoken";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { LoginUserService } from "src/model/services/login-user.service";
import { AuthClientService } from "../model/services/auth-client.service";
import { ms2s } from "../util/utils";

export interface AuthorizationCodeResult {
    activeLoginId: string;
    clientId: string;
    scope: TokenScope[];
    codeChallenge: string;
}

export interface RefreshTokenResult {
    activeLoginAccessId: string;
    clientId: string;
    tokenUniqueId: string;
    scope: TokenScope[];
}

export enum TokenScope {
    LOGIN_SERVICE = "login",
    LOGIN_SERVICE_REGISTER = "login-register",
    BACKEND = "backend",
    AUTH = "auth",
}

@Injectable()
export class TokenService {
    constructor(
        @Inject("BackendJwtService")
        private readonly backendJwtService: JwtService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly loginUserService: LoginUserService,
    ) {}

    async signAccessToken(user: LoginUser, scope: string[], expiresIn: number): Promise<string> {
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
                expiresIn: ms2s(expiresIn),
                audience: scope,
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

        const expiresIn = ms2s(parseInt(process.env.GROPIUS_AUTHORIZATION_CODE_EXPIRATION_TIME_MS, 10));

        return await this.backendJwtService.signAsync(
            {
                client_id: clientId,
                scope,
                code_challenge: codeChallenge,
                kind: "authorization_code",
            },
            {
                subject: activeLoginId,
                expiresIn,
            },
        );
    }

    async verifyAuthorizationCode(token: string, requiredClientId: string): Promise<AuthorizationCodeResult> {
        const payload = await this.backendJwtService.verifyAsync(token);

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
            scope: payload.scope,
            codeChallenge: payload.code_challenge,
        };
    }

    async signRefreshToken(
        activeLoginId: string,
        clientId: string,
        uniqueId: string | number,
        scope: TokenScope[],
    ): Promise<string> {
        this.verifyScope(scope);

        const expiresIn = ms2s(parseInt(process.env.GROPIUS_REFRESH_TOKEN_EXPIRATION_TIME_MS, 10));

        return await this.backendJwtService.signAsync(
            {
                client_id: clientId,
                scope,
                kind: "refresh_token",
            },
            {
                subject: activeLoginId,
                expiresIn,
                jwtid: uniqueId.toString(),
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
        let user: LoginUser | null;
        if (!audience.includes(TokenScope.LOGIN_SERVICE_REGISTER)) {
            user = await this.loginUserService.findOneBy({
                neo4jId: payload.sub,
            });
        } else {
            user = await this.loginUserService.findOneBy({ id: payload.sub });
        }
        const tokenIssuedAt = payload.iat as number;
        const revokeBefore = user?.revokeTokensBefore.getTime();
        if (revokeBefore !== undefined && ms2s(revokeBefore) > tokenIssuedAt) {
            throw new Error("Token invalid");
        }
        user = user ?? null;
        return { user };
    }

    async verifyRefreshToken(token: string, requiredClientId: string): Promise<RefreshTokenResult> {
        const payload = await this.backendJwtService.verifyAsync(token);

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
            activeLoginAccessId: payload.sub,
            clientId: payload.client_id,
            tokenUniqueId: payload.jti,
            scope: payload.scope,
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

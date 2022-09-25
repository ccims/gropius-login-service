import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JsonWebTokenError } from "jsonwebtoken";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { LoginUserService } from "src/model/services/login-user.service";

export interface ActiveLoginTokenResult {
    activeLoginId: string;
    clientId: string;
    tokenUniqueId: string;
}

export enum TokenScope {
    LOGIN_SERVICE = "login",
    LOGIN_SERVICE_REGISTER = "login-register",
    BACKEND = "backend",
    REFRESH_TOKEN = "token",
    NONE = "none",
}

@Injectable()
export class TokenService {
    constructor(
        @Inject("BackendJwtService")
        private readonly backendJwtService: JwtService,
        private readonly activeLoginService: ActiveLoginService,
        private readonly loginUserService: LoginUserService,
    ) {}

    async signBackendAccessToken(user: LoginUser, expiresIn?: number): Promise<string> {
        const expiryObject = !!expiresIn ? { expiresIn: expiresIn / 1000 } : {};
        if (!user.neo4jId) {
            throw new Error("Login user without neo4jId: " + user.id);
        }
        return this.backendJwtService.sign(
            {},
            {
                subject: user.neo4jId,
                ...expiryObject,
                audience: [TokenScope.LOGIN_SERVICE, TokenScope.BACKEND],
            },
        );
    }

    async signLoginOnlyAccessToken(user: LoginUser, expiresIn?: number): Promise<string> {
        const expiryObject = !!expiresIn ? { expiresIn: expiresIn / 1000 } : {};
        return this.backendJwtService.sign(
            {},
            {
                subject: user.id,
                ...expiryObject,
                audience: [TokenScope.LOGIN_SERVICE],
            },
        );
    }

    async verifyAccessToken(token: string): Promise<{ user: LoginUser | null }> {
        const payload = await this.backendJwtService.verifyAsync(token, {
            audience: [TokenScope.LOGIN_SERVICE],
        });
        const audience: TokenScope[] = (payload.aud as string[]).map((scope) => TokenScope[scope]);
        let user: LoginUser | null = null;
        if (audience.includes(TokenScope.BACKEND)) {
            user = await this.loginUserService.findOneBy({
                neo4jId: payload.sub,
            });
        }
        if (!user) {
            user = await this.loginUserService.findOneBy({ id: payload.sub });
        }
        user = user ?? null;
        return { user };
    }

    async signRegistrationToken(activeLoginId: string, expiresIn?: number): Promise<string> {
        const expiryObject = !!expiresIn ? { expiresIn: expiresIn / 1000 } : {};
        return this.backendJwtService.signAsync(
            {},
            {
                subject: activeLoginId,
                ...expiryObject,
                audience: [TokenScope.LOGIN_SERVICE_REGISTER],
                secret: process.env.GROPIUS_LOGIN_SPECIFIC_JWT_SECRET,
            },
        );
    }

    async verifyRegistrationToken(token: string): Promise<string> {
        const payload = await this.backendJwtService.verifyAsync(token, {
            audience: [TokenScope.LOGIN_SERVICE_REGISTER],
            secret: process.env.GROPIUS_LOGIN_SPECIFIC_JWT_SECRET,
        });
        return payload.sub;
    }

    async signActiveLoginCode(
        activeLoginId: string,
        clientId: string,
        uniqueId: string | number,
        expiresIn?: number,
    ): Promise<string> {
        const expiryObject = expiresIn !== undefined ? { expiresIn: expiresIn / 1000 } : {};
        return await this.backendJwtService.signAsync(
            {
                client_id: clientId,
            },
            {
                subject: activeLoginId,
                ...expiryObject,
                jwtid: uniqueId.toString(),
                secret: process.env.GROPIUS_LOGIN_SPECIFIC_JWT_SECRET,
                audience: [TokenScope.REFRESH_TOKEN],
            },
        );
    }

    async verifyActiveLoginToken(token: string, requiredClientId: string): Promise<ActiveLoginTokenResult> {
        const payload = await this.backendJwtService.verifyAsync(token, {
            secret: process.env.GROPIUS_LOGIN_SPECIFIC_JWT_SECRET,
            audience: [TokenScope.REFRESH_TOKEN],
        });
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
        };
    }
}

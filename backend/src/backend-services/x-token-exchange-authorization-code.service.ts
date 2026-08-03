import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthorizationCodeResult, TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { OAuthHttpException } from "../errors/OAuthHttpException";
import { EncryptionService } from "./encryption.service";
import { LoginState } from "src/model/postgres/UserLoginData.entity";
import { OauthTokenResponse } from "../api-oauth/types";
import { compareTimeSafe, hash, ms2s } from "../util/utils";
import { ActiveLoginAccessService } from "../model/services/active-login-access.service";

@Injectable()
export class TokenExchangeAuthorizationCodeService {
    private readonly logger = new Logger(TokenExchangeAuthorizationCodeService.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
        private readonly encryptionService: EncryptionService,
        private readonly activeLoginAccessService: ActiveLoginAccessService,
    ) {}

    /**
     * Exchange authorization code for access token
     */
    async use(req: Request, res: Response, client: AuthClient): Promise<OauthTokenResponse> {
        /**
         * Authorization Code
         */
        const token = req.body.code;
        let data: AuthorizationCodeResult;
        try {
            data = await this.tokenService.verifyAuthorizationCode(token, client.id);
        } catch (err: any) {
            this.logger.warn(err);
            throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
        }

        /**
         * Active Login
         */
        const activeLogin = await this.activeLoginService.findOneByOrFail({ id: data.activeLoginId });
        activeLogin.assert();
        await this.activeLoginService.extendExpiration(activeLogin);

        /**
         * Redirect URI
         *
         * The code carries the redirect uri of the authorize request it came from (RFC 6749
         * section 4.1.3). Codes issued before this was introduced carry none, and the two
         * bundled frontends do not send one yet, so it is only enforced when both sides
         * supply it. Once every client sends `redirect_uri`, make a missing one a hard error.
         */
        const presentedRedirectUri = req.body.redirect_uri;
        if (presentedRedirectUri !== undefined && data.redirectUri !== undefined) {
            if (typeof presentedRedirectUri !== "string" || presentedRedirectUri !== data.redirectUri) {
                this.logger.warn("Redirect uri does not match the one of the authorize request");
                throw new OAuthHttpException("invalid_grant", "Redirect uri does not match");
            }
        } else if (data.redirectUri !== undefined) {
            this.logger.warn(
                `Client ${client.id} redeemed an authorization code without a redirect_uri; ` +
                    "this will become an error in a future release",
            );
        }

        /**
         * Claim the authorization code
         *
         * Inserting the fingerprint under a unique constraint is what makes this single use:
         * checking first and inserting later lets two concurrent requests both pass. A code
         * presented twice means it may have leaked, so every token already issued for this
         * login is revoked (RFC 6819 section 5.2.1.1).
         */
        const activeLoginAccess = await this.activeLoginAccessService.claimAuthorizationCode(activeLogin, hash(token));
        if (!activeLoginAccess) {
            this.logger.warn(`Authorization code replayed for active login ${activeLogin.id}; revoking its tokens`);
            await this.activeLoginAccessService.invalidateByActiveLoginId(activeLogin.id);
            activeLogin.isValid = false;
            await this.activeLoginService.save(activeLogin);
            throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
        }

        /**
         * Code Challenge
         */
        const codeVerifier = req.body.code_verifier;
        if (!codeVerifier) {
            this.logger.warn("Code verifier missing");
            throw new OAuthHttpException("invalid_request", "Code verifier missing");
        }

        if (typeof codeVerifier !== "string") {
            this.logger.warn("Code verifier is not a string");
            throw new OAuthHttpException("invalid_request", "Code verifier has invalid format");
        }

        const decryptedCodeChallenge = this.encryptionService.decrypt(data.codeChallenge);
        const codeChallenge = this.tokenService.calculateCodeChallenge(codeVerifier);
        if (!compareTimeSafe(decryptedCodeChallenge, codeChallenge)) {
            this.logger.warn("Code verifier does not match code challenge");
            throw new OAuthHttpException("invalid_request", "Code verifier does not match code challenge");
        }

        /**
         * Scope
         */
        for (const requestedScope of data.scope) {
            if (!client.validScopes.includes(requestedScope)) {
                throw new OAuthHttpException("invalid_scope", "Requested scope not valid for client");
            }
        }

        /**
         * Login Data
         */
        const loginData = await activeLogin.loginInstanceFor;
        if (!loginData) {
            this.logger.warn("Login data not found");
            throw new OAuthHttpException("invalid_grant", "No login found for given grant (refresh token/code)");
        }

        if (loginData.state !== LoginState.VALID) {
            throw new OAuthHttpException("invalid_grant", "Login data state is not valid");
        }

        const user = await loginData.user;
        if (!user) {
            throw new OAuthHttpException("invalid_state", "No user for valid login");
        }

        /**
         * Response
         */
        const tokenExpiresInMs: number = parseInt(process.env.GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS, 10);
        const accessToken = await this.tokenService.signAccessToken(user, data.scope, tokenExpiresInMs);

        const refreshToken = await this.tokenService.signRefreshToken(
            activeLoginAccess.id,
            client.id,
            activeLoginAccess.refreshTokenCounter,
            data.scope,
        );

        return {
            access_token: accessToken,
            token_type: "bearer",
            expires_in: ms2s(tokenExpiresInMs),
            refresh_token: refreshToken,
            scope: data.scope.join(" "),
        };
    }
}

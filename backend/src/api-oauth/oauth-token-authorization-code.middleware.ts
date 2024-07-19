import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { ActiveLoginTokenResult, TokenScope, TokenService } from "src/backend-services/token.service";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { AuthStateServerData } from "src/strategies/AuthResult";
import { OAuthHttpException } from "./OAuthHttpException";
import { StateMiddleware } from "./StateMiddleware";
import { EncryptionService } from "./encryption.service";

@Injectable()
export class OAuthTokenAuthorizationCodeMiddleware extends StateMiddleware<
    { client: AuthClient },
    AuthStateServerData & { scope: TokenScope[] }
> {
    private readonly logger = new Logger(OAuthTokenAuthorizationCodeMiddleware.name);
    constructor(
        private readonly activeLoginService: ActiveLoginService,
        private readonly tokenService: TokenService,
        private readonly encryptionService: EncryptionService,
    ) {
        super();
    }

    private throwGenericCodeError() {
        throw new OAuthHttpException("invalid_grant", "Given code was invalid or expired");
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: { client: AuthClient } & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        let tokenData: ActiveLoginTokenResult;
        const currentClient = state.client;
        const codeVerifier = req.body.code_verifier;
        try {
            tokenData = await this.tokenService.verifyActiveLoginToken(
                req.body.code ?? req.body.refresh_token,
                currentClient.id,
            );
        } catch (err) {
            this.logger.warn(err);
            return this.throwGenericCodeError();
        }

        const activeLogin = await this.activeLoginService.findOneBy({
            id: tokenData.activeLoginId,
        });
        if (!activeLogin) {
            this.logger.warn("No active login with id", tokenData.activeLoginId);
            return this.throwGenericCodeError();
        }
        if (!activeLogin.isValid) {
            this.logger.warn("Active login set invalid", tokenData.activeLoginId);
            return this.throwGenericCodeError();
        }
        if (activeLogin.expires != null && activeLogin.expires <= new Date()) {
            this.logger.warn("Active login is expired", tokenData.activeLoginId);
            return this.throwGenericCodeError();
        }
        const codeUniqueId = parseInt(tokenData.tokenUniqueId, 10);
        if (!isFinite(codeUniqueId) || codeUniqueId !== activeLogin.nextExpectedRefreshTokenNumber) {
            //Make active login invalid if code/refresh token is reused
            activeLogin.isValid = false;
            await this.activeLoginService.save(activeLogin);
            this.logger.warn(
                "Code is no longer valid as it was already used and a token was already generated.\n " +
                    "Active login has been made invalid",
                tokenData.activeLoginId,
            );
            throw new OAuthHttpException("invalid_grant", "Given code was liekely reused. Login and codes invalidated");
        }
        console.log(tokenData)
        if (tokenData.codeChallenge != undefined) {
            if (codeVerifier == undefined) {
                this.logger.warn("Code verifier missing");
                throw new OAuthHttpException("invalid_request", "Code verifier missing");
            }
            const decryptedCodeChallenge = this.encryptionService.decrypt(tokenData.codeChallenge);
            const codeChallenge = this.tokenService.calculateCodeChallenge(codeVerifier);
            if (decryptedCodeChallenge !== codeChallenge) {
                this.logger.warn("Code verifier does not match code challenge");
                throw new OAuthHttpException("invalid_request", "Code verifier does not match code challenge");
            }
        } else {
            if (codeVerifier != undefined) {
                this.logger.warn("Code verifier not required");
                throw new OAuthHttpException("invalid_request", "Code verifier not required");
            }
        }
        this.appendState(res, { activeLogin, scope: tokenData.scope });
        next();
    }
}

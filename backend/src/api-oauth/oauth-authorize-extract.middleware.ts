import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeRequest, OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { TokenScope } from "src/backend-services/token.service";
import { EncryptionService } from "./encryption.service";
import { OAuthHttpException } from "./OAuthHttpException";

@Injectable()
export class OAuthAuthorizeExtractMiddleware extends StateMiddleware<{}, Omit<OAuthAuthorizeServerState, "client">> {
    constructor(private readonly encryptionService: EncryptionService) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ) {
        const codeChallenge = req.query.code_challenge as string | undefined;
        if (!codeChallenge) {
            throw new OAuthHttpException("invalid_request", "Code challenge required");
        }
        if (!/^([a-zA-Z0-9.\-_~]){43,128}$/.test(codeChallenge)) {
            throw new OAuthHttpException("invalid_request", "Code challenge must be between 43 and 128 characters");
        }
        const requestParams: OAuthAuthorizeRequest = {
            state: req.query.state as string,
            redirect: req.query.redirect_uri as string,
            clientId: req.query.client_id as string,
            scope: (req.query.scope as string).split(" ").filter((s) => s.length > 0) as TokenScope[],
            codeChallenge: this.encryptionService.encrypt(codeChallenge),
            codeChallengeMethod: req.query.code_challenge_method as string,
            responseType: req.query.response_type as "code",
        };
        this.appendState(res, {
            request: requestParams,
            isRegisterAdditional: requestParams.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER),
        });
        next();
    }
}

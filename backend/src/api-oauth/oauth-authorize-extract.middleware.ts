import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeRequest, OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { AuthClientService } from "src/model/services/auth-client.service";
import { TokenScope } from "src/backend-services/token.service";

@Injectable()
export class OAuthAuthorizeExtractMiddleware extends StateMiddleware<{}, OAuthAuthorizeServerState> {
    constructor(private readonly authClientService: AuthClientService) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ) {
        const requestParams: OAuthAuthorizeRequest = {
            state: req.query.state as string,
            redirect: req.query.redirect as string,
            clientId: req.query.client_id as string,
            scope: (req.query.scope as string).split(" ").filter((s) => s.length > 0) as TokenScope[],
            codeChallenge: req.query.code_challenge as string,
            codeChallengeMethod: req.query.code_challenge_method as string,
            responseType: req.query.response_type as "code",
        };
        const client = await this.authClientService.findOneBy({ id: requestParams.clientId });
        this.appendState(res, { request: requestParams, client });
        next();
    }
}

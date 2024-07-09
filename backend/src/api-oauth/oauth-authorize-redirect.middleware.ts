import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";
import { TokenScope } from "src/backend-services/token.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class OAuthAuthorizeRedirectMiddleware extends StateMiddleware<
    OAuthAuthorizeServerState,
    OAuthAuthorizeServerState
> {

    constructor(private readonly jwtService: JwtService) {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        const target = state.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)
            ? "register-additional"
            : "login";
        const encodedState = encodeURIComponent(this.jwtService.sign({ request: state.request }));
        res.redirect(`/auth/flow/${target}?state=${encodedState}`);
    }
}

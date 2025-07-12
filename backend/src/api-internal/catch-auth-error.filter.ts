import { ArgumentsHost, Catch, ExceptionFilter, Inject } from "@nestjs/common";
import { Response } from "express";
import { AuthException } from "./AuthException";
import { TokenScope } from "src/backend-services/token.service";
import { JwtService } from "@nestjs/jwt";
import { combineURL } from "src/util/combineURL";

@Catch(AuthException)
export class CatchAuthErrorFilter implements ExceptionFilter {
    constructor(
        @Inject("StateJwtService")
        private readonly stateJwtService: JwtService,
    ) {}

    catch(error: AuthException, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse<Response>();
        if (!res.state.request) throw error;

        const target = res.state.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)
            ? "register-additional"
            : "login";
        const encodedState = encodeURIComponent(this.stateJwtService.sign({ request: res.state.request }));
        const url = `auth/flow/${target}?error=${encodeURIComponent(error.authErrorMessage)}&strategy_instance=${encodeURIComponent(error.strategyInstanceId)}&state=${encodedState}`;
        res.redirect(combineURL(url, process.env.GROPIUS_ENDPOINT).toString());
    }
}

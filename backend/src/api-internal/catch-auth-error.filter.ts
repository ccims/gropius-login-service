import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { AuthException } from "./AuthException";
import { TokenScope } from "src/backend-services/token.service";
import { combineURL } from "src/util/combineURL";

@Catch(AuthException)
export class CatchAuthErrorFilter implements ExceptionFilter {
    catch(error: AuthException, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse<Response>();
        if (!res.state.request) throw error;

        const target = res.state.request.scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)
            ? "register-additional"
            : "login";
        const url = `auth/flow/${target}?error=${encodeURIComponent(error.authErrorMessage)}&strategy_instance=${encodeURIComponent(error.strategyInstanceId)}`;
        res.redirect(combineURL(url, process.env.GROPIUS_ENDPOINT).toString());
    }
}

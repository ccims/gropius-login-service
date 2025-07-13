import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthException } from "../AuthException";
import { TokenScope } from "src/backend-services/token.service";
import { combineURL } from "../../util/utils";

@Catch(AuthException)
export class CatchAuthErrorFilter implements ExceptionFilter {
    catch(error: AuthException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const req = context.getRequest<Request>();
        const res = context.getResponse<Response>();

        const target = req.internal.getRequest().scope.includes(TokenScope.LOGIN_SERVICE_REGISTER)
            ? "register-additional"
            : "login";
        const url = `auth/flow/${target}?error=${encodeURIComponent(error.authErrorMessage)}&strategy_instance=${encodeURIComponent(error.strategyInstanceId)}`;
        res.redirect(combineURL(url, process.env.GROPIUS_ENDPOINT).toString());
    }
}

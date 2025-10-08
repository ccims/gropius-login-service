import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthException } from "./AuthException";
import { combineURL } from "../util/utils";

@Catch(AuthException)
export class CatchAuthErrorFilter implements ExceptionFilter {
    catch(error: AuthException, host: ArgumentsHost) {
        console.log(error);

        const context = host.switchToHttp();
        const req = context.getRequest<Request>();
        const res = context.getResponse<Response>();

        // TODO: remove logs
        console.log("session", req.session);

        const target = req.context.flow.isRegisterAdditional() ? "register-additional" : "login";
        const url = `auth/flow/${target}?error=${encodeURIComponent(error.authErrorMessage)}&strategy_instance=${encodeURIComponent(error.strategyInstanceId)}`;
        res.redirect(combineURL(url, process.env.GROPIUS_ENDPOINT).toString());
    }
}

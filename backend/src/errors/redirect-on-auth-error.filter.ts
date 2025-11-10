import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthException } from "./AuthException";
import { combineURL } from "../util/utils";

@Catch(AuthException)
export class RedirectOnAuthErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(this.constructor.name);

    catch(error: AuthException, host: ArgumentsHost) {
        this.logger.error(error);

        const context = host.switchToHttp();
        const req = context.getRequest<Request>();
        const res = context.getResponse<Response>();

        const target = req.context.flow.isLinkFlow() ? "register-additional" : "login";
        const url = `auth/flow/${target}?error=${encodeURIComponent(error.authErrorMessage)}&strategy_instance=${encodeURIComponent(error.strategyInstanceId)}`;
        res.redirect(combineURL(url, process.env.GROPIUS_ENDPOINT).toString());
    }
}

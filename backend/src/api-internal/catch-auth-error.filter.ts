import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthException } from "./AuthException";
import { combineURL } from "../util/utils";

@Catch(AuthException)
export class CatchAuthErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(this.constructor.name);

    catch(error: AuthException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const req = context.getRequest<Request>();
        const res = context.getResponse<Response>();

        this.logger.error(error);
        this.logger.debug("session", req.session);

        const target = req.context.flow.isLinkFlow() ? "register-additional" : "login";
        const url = `auth/flow/${target}?error=${encodeURIComponent(error.authErrorMessage)}&strategy_instance=${encodeURIComponent(error.strategyInstanceId)}`;
        res.redirect(combineURL(url, process.env.GROPIUS_ENDPOINT).toString());
    }
}

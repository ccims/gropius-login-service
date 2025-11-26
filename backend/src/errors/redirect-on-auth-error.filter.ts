import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthException } from "./AuthException";
import { combineURL } from "../util/utils";

@Catch(AuthException)
export class RedirectOnAuthErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(this.constructor.name);

    catch(error: AuthException, host: ArgumentsHost) {
        if (error instanceof Error) {
            this.logger.error(error.stack);
        } else {
            this.logger.error(error);
        }

        const context = host.switchToHttp();
        const req = context.getRequest<Request>();
        const res = context.getResponse<Response>();

        const target = req.context.flow.isLinkFlow() ? "register-additional" : "login";
        const url = combineURL(`auth/flow/${target}`, process.env.GROPIUS_ENDPOINT);
        url.searchParams.append("error", error.authErrorMessage);
        url.searchParams.append("strategy_instance", error.strategyInstanceId);
        res.redirect(url.toString());
    }
}

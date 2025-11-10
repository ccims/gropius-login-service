import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { OAuthHttpException } from "./OAuthHttpException";

@Catch(OAuthHttpException)
export class RedirectOnOAuthErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(this.constructor.name);

    catch(error: OAuthHttpException, host: ArgumentsHost) {
        this.logger.error(error);

        const context = host.switchToHttp();
        const req = context.getRequest<Request>();
        const res = context.getResponse<Response>();

        if (!req.context.flow.tryRequest()) throw error;

        const url = new URL(req.context.flow.getRequest().redirect);
        url.searchParams.append("error", error.error_type);
        url.searchParams.append(
            "error_description",
            error.error_message.replace(/[^\x20-\x21\x23-\x5B\x5D-\x7E]/g, ""),
        );
        return res.redirect(url.toString());
    }
}

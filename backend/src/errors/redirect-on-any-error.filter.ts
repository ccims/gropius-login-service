import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { OAuthHttpException } from "./OAuthHttpException";
import { combineURL } from "../util/utils";

@Catch()
export class RedirectOnAnyErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(this.constructor.name);

    catch(error: unknown, host: ArgumentsHost) {
        this.logger.error(error);
        console.log(error);

        const context = host.switchToHttp();
        const req = context.getRequest<Request>();
        const res = context.getResponse<Response>();

        const url = combineURL(`auth/flow/login`, process.env.GROPIUS_ENDPOINT);
        url.searchParams.append("error", "server_error");
        url.searchParams.append("error_description", "An internal server error occurred");
        return res.redirect(url.toString());
    }
}

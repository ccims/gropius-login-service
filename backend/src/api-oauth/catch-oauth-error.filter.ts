import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Response } from "express";
import { OAuthHttpException } from "./OAuthHttpException";

@Catch(OAuthHttpException)
export class CatchOAuthErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(CatchOAuthErrorFilter.name);

    catch(error: OAuthHttpException, host: ArgumentsHost) {
        console.log("hiere", error);

        const res = host.switchToHttp().getResponse<Response>();
        if (!res.state.request) throw error;

        const url = new URL(res.state.request.redirect);
        if (error.error_type && error.error_message) {
            url.searchParams.append("error", error.error_type);
            url.searchParams.append(
                "error_description",
                error.error_message.replace(/[^\x20-\x21\x23-\x5B\x5D-\x7E]/g, ""),
            );
        } else {
            this.logger.error("Unknown error", error);
            url.searchParams.append("error", "server_error");
            url.searchParams.append("error_description", encodeURIComponent("An unknown error occurred"));
        }

        res.redirect(url.toString());
    }
}

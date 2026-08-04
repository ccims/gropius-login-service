import { type ArgumentsHost, Catch, type ExceptionFilter, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { OAuthHttpException } from "./OAuthHttpException.js";
import { combineURL } from "../util/utils.js";
import { RedirectOnErrorFilter } from "./redirect-on-error.filter.js";

@Catch()
export class RedirectOnAnyErrorFilter extends RedirectOnErrorFilter {
    use(error: unknown, req: Request, res: Response) {
        const url = combineURL(`auth/flow/login`, process.env.GROPIUS_ENDPOINT);
        url.searchParams.append("error", "server_error");
        url.searchParams.append("error_description", "An internal server error occurred");
        return res.redirect(url.toString());
    }
}

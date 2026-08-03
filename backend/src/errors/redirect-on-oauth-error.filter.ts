import { Catch, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";
import { OAuthHttpException } from "./OAuthHttpException.js";
import { RedirectOnErrorFilter } from "./redirect-on-error.filter.js";

@Catch(OAuthHttpException)
export class RedirectOnOAuthErrorFilter extends RedirectOnErrorFilter {
    use(error: OAuthHttpException, req: Request, res: Response) {
        const description = error.error_message.replace(/[^\x20-\x21\x23-\x5B\x5D-\x7E]/g, "");

        // The authorize request is only stored once it has been fully validated. If it failed
        // validation (unknown client, disallowed redirect uri, missing PKCE challenge, ...)
        // there is no redirect uri that may be trusted, so the error has to be reported
        // directly instead. RFC 6749 section 4.1.2.1 requires exactly that.
        const request = req.context?.flow?.tryRequest();
        if (!request) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                error: error.error_type,
                error_description: description,
            });
        }

        const url = new URL(request.redirect);
        url.searchParams.append("error", error.error_type);
        url.searchParams.append("error_description", description);
        return res.redirect(url.toString());
    }
}

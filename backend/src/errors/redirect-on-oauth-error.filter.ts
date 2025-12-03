import { Catch } from "@nestjs/common";
import { Request, Response } from "express";
import { OAuthHttpException } from "./OAuthHttpException";
import { RedirectOnErrorFilter } from "./redirect-on-error.filter";

@Catch(OAuthHttpException)
export class RedirectOnOAuthErrorFilter extends RedirectOnErrorFilter {
    use(error: OAuthHttpException, req: Request, res: Response) {
        const url = new URL(req.context.flow.getRequest().redirect);
        url.searchParams.append("error", error.error_type);
        url.searchParams.append(
            "error_description",
            error.error_message.replace(/[^\x20-\x21\x23-\x5B\x5D-\x7E]/g, ""),
        );
        return res.redirect(url.toString());
    }
}

import { Catch } from "@nestjs/common";
import { AuthException } from "./AuthException";
import { combineURL } from "../util/utils";
import { RedirectOnErrorFilter } from "./redirect-on-error.filter";
import { Request, Response } from "express";

@Catch(AuthException)
export class RedirectOnAuthErrorFilter extends RedirectOnErrorFilter {
    use(error: AuthException, req: Request, res: Response) {
        const target = req.context.flow.isLinkFlow() ? "register-additional" : "login";
        const url = combineURL(`auth/flow/${target}`, process.env.GROPIUS_ENDPOINT);
        url.searchParams.append("error", error.authErrorMessage);
        url.searchParams.append("strategy_instance", error.strategyInstanceId);
        return res.redirect(url.toString());
    }
}

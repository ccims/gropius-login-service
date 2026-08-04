import { Injectable, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { combineURL } from "../util/utils.js";
import { FlowState } from "../util/Context.js";

@Injectable()
export class LoginRedirectService {
    private readonly logger = new Logger(this.constructor.name);

    /**
     * Redirect user to login page
     */
    async use(req: Request, res: Response) {
        req.context.flow.setState(FlowState.LOGIN);
        return res.redirect(combineURL(`auth/flow/login`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

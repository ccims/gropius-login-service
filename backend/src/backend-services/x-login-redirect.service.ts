import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { combineURL } from "../util/utils";
import { FlowState } from "../util/Context";

@Injectable()
export class LoginRedirectService {
    private readonly logger = new Logger(this.constructor.name);

    async use(req: Request, res: Response) {
        req.context.flow.setState(FlowState.LOGIN);
        return res.redirect(combineURL(`auth/flow/login`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

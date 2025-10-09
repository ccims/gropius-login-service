import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { combineURL } from "../util/utils";

@Injectable()
export class PromptRedirectService {
    private readonly logger = new Logger(this.constructor.name);

    async use(req: Request, res: Response) {
        return res.redirect(combineURL(`auth/flow/prompt`, process.env.GROPIUS_ENDPOINT).toString());
    }
}

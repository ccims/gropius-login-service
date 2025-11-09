import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { combineURL, compareTimeSafe } from "../util/utils";

@Injectable()
export class CSRFService {
    private readonly logger = new Logger(this.constructor.name);

    async use(req: Request, res: Response) {
        const found = req.body?.csrf ?? req.header("x-csrf-token") ?? req.query?.csrf ?? req.params?.csrf;
        if (!found) throw new Error("No CSRF token provided");
        if (!compareTimeSafe(found, req.context.auth.getCSRF())) throw new Error("Invalid CSRF token provided");
    }
}

import { NextFunction, Request, Response } from "express";
import { compareTimeSafe } from "./utils";

export default function CSRFMiddleware(req: Request, res: Response, next: NextFunction) {
    // TODO: reg workaround
    const yes = true;
    if (yes) return next();

    const found = req.body?.csrf ?? req.header("x-csrf-token") ?? req.query?.csrf ?? req.params?.csrf;
    if (!found) throw new Error("No CSRF token provided");

    // TODO: use getSessionCSRF
    if (!compareTimeSafe(found, req.context.getCSRF())) throw new Error("Invalid CSRF token provided");

    console.log("valid CSRF");

    next();
}

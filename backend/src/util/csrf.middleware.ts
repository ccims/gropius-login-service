import { NextFunction, Request, Response } from "express";

export default function CSRFMiddleware(req: Request, res: Response, next: NextFunction) {
    const found = req.body.csrf ?? req.header("x-csrf-token") ?? req.query.csrf ?? req.params.csrf;
    if (!found) throw new Error("No csrf token provided");

    if (found !== req.flow.getCSRF()) throw new Error("Invalid CSRF token provided");

    console.log("valid csrf");

    next();
}

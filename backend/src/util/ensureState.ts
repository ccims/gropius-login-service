import { Response } from "express";

export function ensureState(res: Response) {
    if (res == undefined || res == null) {
        throw new Error("Res object mustn't be null/undefined");
    }
    if (!res.locals) {
        res.locals = {};
    }
    if (!res.locals.state) {
        res.locals.state = {};
    }
}

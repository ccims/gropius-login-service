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

export function checkType(
    object: object,
    key: string,
    type: "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined",
): boolean | string {
    const value = object[key];
    if (!value) {
        return `Value for ${key} is missing.`;
    }
    if (typeof value != type) {
        return `Expected ${key} to be of type ${type}`;
    }
    if (typeof value == "string") {
        if (value.trim().length == 0) {
            return `${key} cannot be empty`;
        }
    }
    return true;
}

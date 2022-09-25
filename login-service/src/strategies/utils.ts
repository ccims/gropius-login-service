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

/**
 * Checks a key if an object for a specified type using the typeof operator.
 * If type is "string" will also check, the value is not empty.
 *
 * If nullable and a default is given, this will be returned, if the field is undefined
 * (NOT if the type check was unsuccessful)
 *
 * @param object The object in which to check the key
 * @param key The key in the object in which to check the type
 * @param type The Expected type of the field. Must be one of the types returned by the `typeof` operator
 * @param nullable Set to true if the field may be undefined
 * @param defaultValue If undefined, this value will be returned instead
 * @returns The field value if the type check was successful, if undefined and nullable the default value
 * @throws {@link Error} with according message if the type check wasn't successful
 */
export function checkType(
    object: object,
    key: string,
    type: "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined",
    nullable?: boolean,
    defaultValue?: any,
): any {
    const value = object[key];
    if (!nullable || !!value) {
        if (!value) {
            throw new Error(`Value for ${key} is missing.`);
        }
        if (typeof value != type) {
            throw new Error(`Expected ${key} to be of type ${type}`);
        }
        if (typeof value == "string") {
            if (value.trim().length == 0) {
                throw new Error(`${key} cannot be empty`);
            }
        }
        return value;
    } else {
        return defaultValue;
    }
}

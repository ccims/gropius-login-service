import * as crypto from "crypto";

export function now() {
    return Math.floor(Date.now() / 1000);
}

export const MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

export const TEN_MINUTES_IN_SECONDS = 10 * 60;

export function combineURL(path: string, base: string): URL {
    let fixedBase = base;
    if (!fixedBase.endsWith("/")) {
        fixedBase += "/";
    }
    return new URL(path, fixedBase);
}

export function compareTimeSafe(found: string, expected: string): boolean {
    const expectedBuffer = Buffer.from(expected);
    const foundBuffer = found.length === expected.length ? Buffer.from(found) : Buffer.alloc(expectedBuffer.length);
    return crypto.timingSafeEqual(foundBuffer, expectedBuffer) && found.length === expected.length;
}

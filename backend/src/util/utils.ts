import * as crypto from "crypto";

export function now() {
    return Math.floor(Date.now() / 1000);
}

export function combineURL(path: string, base: string): URL {
    let fixedBase = base;
    if (!fixedBase.endsWith("/")) {
        fixedBase += "/";
    }
    return new URL(path, fixedBase);
}

export function compareTimeSafe(found: string, expected: string): boolean {
    if (!found || !expected) return false;
    const expectedBuffer = Buffer.from(expected);
    const foundBuffer = found.length === expected.length ? Buffer.from(found) : Buffer.alloc(expectedBuffer.length);
    return crypto.timingSafeEqual(foundBuffer, expectedBuffer) && found.length === expected.length;
}

export function hash(data: string): string {
    return crypto.createHash("sha256").update(data).digest("base64url");
}

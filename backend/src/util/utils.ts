export function now() {
    return Math.floor(Date.now() / 1000);
}

export const MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

export function combineURL(path: string, base: string): URL {
    let fixedBase = base;
    if (!fixedBase.endsWith("/")) {
        fixedBase += "/";
    }
    return new URL(path, fixedBase);
}

export function combineURL(path: string, base: string): URL {
    let fixedBase = base;
    if (!fixedBase.endsWith("/")) {
        fixedBase += "/";
    }
    return new URL(path, fixedBase);
}
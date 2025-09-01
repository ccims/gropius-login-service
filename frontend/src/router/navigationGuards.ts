import { RouteLocationNormalized, RouteLocationRaw } from "vue-router";
import * as auth from "../util/auth";

export async function checkAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    const code = to.query.code;
    if (code) {
        await auth.exchangeToken(code.toString());

        const next = auth.getRouterTo() ?? "accounts";
        auth.removeRouterTo();

        return {
            name: next,
            replace: true
        };
    }

    try {
        await auth.loadToken();
    } catch (error: any) {
        await auth.authorizeUser(["auth", "login"], {}, to.fullPath);
    }

    return true;
}

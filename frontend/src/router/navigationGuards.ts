import { RouteLocationNormalized, RouteLocationRaw } from "vue-router";
import * as auth from "../util/auth";
import router from "@/router/index";

export async function checkAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    const code = to.query.code;
    if (code) {
        await auth.exchangeToken(code.toString());

        const next = auth.getRedirectTo() ?? "/account";
        auth.removeRedirectTo();
        return {
            ...router.resolve(next),
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

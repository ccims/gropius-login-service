import { RouteLocationNormalized, RouteLocationRaw } from "vue-router";
import * as auth from "../util/auth";

export async function checkAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    const code = to.query.code;
    if (code) {
        await auth.exchangeToken(code.toString());
        // TODO: redirect to state.to
        return {
            name: "account",
            replace: true
        };
    }

    try {
        await auth.loadToken();
    } catch (error: any) {
        await auth.authorizeUser(["auth", "login"], { to: to.fullPath });
    }

    return true;
}

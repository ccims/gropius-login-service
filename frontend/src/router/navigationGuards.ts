import { RouteLocationNormalized, RouteLocationRaw } from "vue-router";
import * as oauth from "../util/oauth";

export async function checkAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    const id = to.query.id as string;

    // Check if user had been already authenticated
    const token = oauth.getAccessToken();
    if (token) {
        if (!token.expired) return true;
        oauth.clean();
        window.location.href = await oauth.constructAuthorizeUrl({ id });
    }

    // User has not been authenticated yet
    if (to.query.code == undefined) {
        window.location.href = await oauth.constructAuthorizeUrl({ id });
    }

    return true;
}

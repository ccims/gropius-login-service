import { RouteLocationNormalized, RouteLocationRaw } from "vue-router";
import * as oauth from "../util/oauth";

export async function checkAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    // If this is not an oauth callback, then ensure that access token exists
    if (to.query.code == undefined) {
        await oauth.loadAccessToken();
    }

    return true;
}

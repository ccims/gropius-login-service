import { RouteLocationNormalized, RouteLocationRaw } from "vue-router";
import * as oauth from "../util/oauth";

export async function checkAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    const id = to.query.id as string;

    if (to.query.code == undefined) {
        try {
            await oauth.loadToken();
        } catch (error: Error) {
            console.error(error);
            await oauth.authorizeUser({ id });
        }
    }

    return true;
}

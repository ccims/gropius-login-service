import { RouteLocationNormalized, RouteLocationRaw } from "vue-router";
import * as oauth from '../util/oauth'

export async function checkAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    const id = to.query.id as string

    // Check if user had been already authenticated
    const token = oauth.getAccessToken()
    if (token) {
        // If access token is not expired, then the user is still authentiaced
        if (!token.expired) return true

        // Reauthenticate the user using slient authenticaion
        oauth.clean()
        window.location.href = await oauth.constructAuthorizeUrl({id, silent: true});
    }

    // User has not been authentiacted yet
    if (to.query.code == undefined) {
        window.location.href = await oauth.constructAuthorizeUrl({id, silent: false});
    }

    return true;
}

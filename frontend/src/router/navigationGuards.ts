import { RouteLocationNormalized, RouteLocationRaw } from "vue-router";

export async function checkAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    if (to.query.code == undefined) {
        window.location.href = await buildOAuthUrl(to.query.id as string);
    }
    return true;
}

async function buildOAuthUrl(id: string): Promise<string> {
    const codeVerifierArray = new Uint8Array(32);
    crypto.getRandomValues(codeVerifierArray);
    const codeVerifier = base64URLEncode(String.fromCharCode.apply(null, Array.from(codeVerifierArray)));
    localStorage.setItem("loginServiceCodeVerifier", codeVerifier);
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
    const codeChallenge = base64URLEncode(String.fromCharCode.apply(null, Array.from(new Uint8Array(hash))));
    return (
        "/auth/oauth/authorize?" +
        new URLSearchParams({
            client_id: "login-auth-client",
            response_type: "code",
            scope: "auth login",
            redirect_uri: window.location.origin + "/auth/flow/update",
            state: JSON.stringify({ id }),
            code_challenge_method: "S256",
            code_challenge: codeChallenge
        }).toString()
    );
}

function base64URLEncode(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
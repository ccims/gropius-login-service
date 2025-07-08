import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { OAuthResponse, PromptData } from "@/views/model";

export type Token = {
    iat: number;
};

function constructKey(key: string) {
    return `gropiusLoginFrontend__${key}`;
}

const LOCAL_STORAGE_CODE_VERIFIER = constructKey("codeVerifier");

export function setCodeVerifier(code: string) {
    localStorage.setItem(LOCAL_STORAGE_CODE_VERIFIER, code);
}

export function getCodeVerifier() {
    return localStorage.getItem(LOCAL_STORAGE_CODE_VERIFIER);
}

export function removeCodeVerifier() {
    localStorage.removeItem(LOCAL_STORAGE_CODE_VERIFIER);
}

const LOCAL_STORAGE_ACCESS_TOKEN = constructKey("accessToken");

export function removeAccessToken() {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
}

export function getAccessToken() {
    const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    if (!token) return;

    const decoded = jwtDecode(token) as Token;

    // Check if token expires in the next 30 seconds
    const now = Math.floor(Date.now() / 1000);
    const buffer = 30;
    const expired = now > decoded.iat + buffer;

    return {
        decoded,
        token,
        expired
    };
}

export async function exchangeToken(code: string) {
    const response: OAuthResponse = await axios.post("/auth/oauth/token", {
        grant_type: "authorization_code",
        client_id: "login-auth-client",
        code,
        code_verifier: getCodeVerifier()
    }).data;

    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, response.access_token);
    removeCodeVerifier();
}

export async function fetchPromptData() {
    return (await axios.get("/auth/api/internal/auth/prompt/data")).data as PromptData;
}

export async function constructAuthorizeUrl(data: { id: string }): Promise<string> {
    const codeVerifierArray = new Uint8Array(32);
    crypto.getRandomValues(codeVerifierArray);
    const codeVerifier = base64URLEncode(String.fromCharCode.apply(null, Array.from(codeVerifierArray)));
    setCodeVerifier(codeVerifier);

    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
    const codeChallenge = base64URLEncode(String.fromCharCode.apply(null, Array.from(new Uint8Array(hash))));

    return (
        "/auth/oauth/authorize?" +
        new URLSearchParams({
            client_id: "login-auth-client",
            response_type: "code",
            scope: "auth login",
            redirect_uri: window.location.origin + "/auth/flow/update",
            state: JSON.stringify({ id: data.id }),
            code_challenge_method: "S256",
            code_challenge: codeChallenge
        }).toString()
    );
}

function base64URLEncode(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function clean() {
    removeAccessToken();
    removeCodeVerifier();
}

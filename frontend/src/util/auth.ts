import { jwtDecode } from "jwt-decode";
import axios from "axios";

export type Token = {
    iat: number;
    exp: number;
};

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export enum TokenScope {
    LOGIN_SERVICE = "login",
    LOGIN_SERVICE_REGISTER = "login-register",
    BACKEND = "backend",
    REFRESH_TOKEN = "token",
    NONE = "none"
}

export interface PromptData {
    userId: string;
    username: string;
    flow: string;
    redirect: string;
    scope: string[];
    clientId: string;
    clientName: string;
}

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
let _refreshToken: string | undefined;

export function setResponse(response: TokenResponse) {
    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, response.access_token);
    _refreshToken = response.refresh_token;
}

export function getAccessToken() {
    return localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
}

export function getRefreshToken() {
    return _refreshToken;
}

export function removeResponse() {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
    _refreshToken = undefined;
}

const LOCAL_STORAGE_ROUTER_TO = constructKey("routerTo");

export function setRouterTo(from: string) {
    localStorage.setItem(LOCAL_STORAGE_ROUTER_TO, from);
}

export function getRouterTo() {
    return localStorage.getItem(LOCAL_STORAGE_ROUTER_TO);
}

// TODO: this
export function removeRouterTo() {
    localStorage.removeItem(LOCAL_STORAGE_ROUTER_TO);
}

export async function loadToken(): Promise<string> {
    // Current access token
    const token = getAccessToken();

    // Check if access token expires soon
    if (token) {
        const decoded = jwtDecode(token) as Token;
        const now = Math.floor(Date.now() / 1000);
        const buffer = 15;
        const expired = now + buffer > decoded.exp;
        if (!expired) return token;
    }

    // Refresh token
    await refreshToken();
    return getAccessToken()!;
}

export async function loadAuthorizationHeader() {
    return {
        headers: {
            Authorization: `Bearer ${await loadToken()}`
        }
    };
}

export async function exchangeToken(code: string) {
    const { data } = await axios.post<TokenResponse>("/auth/oauth/token", {
        grant_type: "authorization_code",
        client_id: "login-auth-client",
        code,
        code_verifier: getCodeVerifier()
    });

    setResponse(data);
    removeCodeVerifier();
}

export async function refreshToken() {
    const token = getRefreshToken();
    if (!token) throw new Error("No refresh token");

    const { data } = await axios.post<TokenResponse>("/auth/oauth/token", {
        grant_type: "refresh_token",
        client_id: "login-auth-client",
        refresh_token: token
    });
    setResponse(data);
}

export async function fetchPromptData() {
    return (await axios.get("/auth/api/internal/auth/prompt/data")).data as PromptData;
}

export async function authorizeUser(scope: string[], state: object, from: string) {
    clean();

    const codeVerifierArray = new Uint8Array(32);
    crypto.getRandomValues(codeVerifierArray);
    const codeVerifier = base64URLEncode(String.fromCharCode.apply(null, Array.from(codeVerifierArray)));
    setCodeVerifier(codeVerifier);

    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
    const codeChallenge = base64URLEncode(String.fromCharCode.apply(null, Array.from(new Uint8Array(hash))));

    setRouterTo(from);

    window.location.href =
        "/auth/oauth/authorize?" +
        new URLSearchParams({
            client_id: "login-auth-client",
            response_type: "code",
            scope: scope.join(" "),
            redirect_uri: window.location.origin + "/auth/flow/account",
            state: JSON.stringify(state),
            code_challenge_method: "S256",
            code_challenge: codeChallenge
        }).toString();
}

function base64URLEncode(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function clean() {
    removeResponse();
    removeCodeVerifier();
    removeRouterTo();
}

export async function loadCSRFHeader() {
    return {
        headers: {
            "x-csrf-token": (await axios.get<{ csrf: string }>(`/auth/api/internal/auth/csrf`)).data.csrf
        }
    };
}

export async function logout(mode: "current" | "everywhere") {
    await axios.post(`/auth/api/internal/auth/logout/${mode}`, {}, await loadCSRFHeader());
    clean();
    window.location.reload();
}

export async function loadExternalCSRFToken() {
    const { data } = await axios.get<{ externalCSRF: string }>(`/auth/api/internal/auth/csrf-external`);
    return data.externalCSRF;
}

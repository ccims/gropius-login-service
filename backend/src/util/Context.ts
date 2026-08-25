import type { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import type { OAuthAuthorizeRequest } from "../api-oauth/types.js";
import { hash, ms2s, now } from "./utils.js";
import { FlowType } from "../strategies/AuthResult.js";
import { ActiveLogin } from "../model/postgres/ActiveLogin.entity.js";
import { Strategy } from "../strategies/Strategy.js";
import { LoginUser } from "../model/postgres/LoginUser.entity.js";

declare global {
    namespace Express {
        export interface Request {
            context: Context;
        }
    }
}

type RequestWithContext = Request & { session: ContextSession };

export enum FlowKind {
    OAUTH = "oauth",
    LINK = "link",
}

export enum FlowState {
    // when starting a new flow
    START = "START",

    // when redirecting the user to login form
    LOGIN = "LOGIN",

    // when redirecting the user to external auth server
    REDIRECT = "REDIRECT",

    // when redirecting the user for consent
    PROMPT = "PROMPT",

    // when redirecting the user for registration
    REGISTER = "REGISTER",
}

/**
 * A passkey (WebAuthn) challenge that was handed out to the client.
 *
 * The challenge is not a secret, it only has to be unpredictable, bound to this session
 * and usable exactly once, all of which holds for the signed session cookie.
 */
export type PasskeyChallenge = {
    // the ceremony the challenge was handed out for
    kind: "registration" | "authentication";

    // base64url encoded challenge
    challenge: string;

    // id of the strategy instance the challenge was handed out for
    strategy_instance_id: string;

    // expires at (in seconds)
    expires_at: number;

    // base64url encoded user handle the credential is created for (registration only)
    user_handle?: string;

    // username the user asked for while registering (registration only)
    username?: string;
};

/**
 * This data is stored in the session, i.e., in the cookie.
 */
export type ContextSession = {
    // session id
    session_id: string;

    // issued at (in seconds)
    issued_at: number;

    // expires at (in seconds)
    expires_at: number;

    // user id
    user_id?: string;

    // active login id
    active_login_id?: string;

    // consent fingerprints of consented oauth authorization request
    consents: string[];

    // csrf token
    csrf: string;

    // the passkey challenge that was handed out and is waiting to be answered
    passkey?: PasskeyChallenge;

    // flow
    flow?: {
        // flow id
        flow_id: string;

        // flow kind
        flow_kind: FlowKind;

        // issued at
        issued_at: number;

        // expires at
        expires_at: number;

        // strategy type name
        strategy_type_name?: string;

        // flow type
        flow_type?: FlowType;

        // active login id
        active_login_id?: string;

        // whether authentication is done via login or register
        via?: "login" | "register";

        // oauth authorization request
        oauth_request?: OAuthAuthorizeRequest;

        // state between redirects
        state: FlowState;
    };
};

/**
 * Persistent session-based authentication used, e.g., for permission prompts and silent authentication.
 * Session data is exposed to the client and MUST NOT contain sensitive information.
 * This session must be only used for flows.
 */
export class Context {
    private readonly req: RequestWithContext;

    auth: Auth;
    flow: Flow;
    passkey: Passkey;

    constructor(req: Request) {
        this.req = req as RequestWithContext;
        this.auth = new Auth(this, this.req);
        this.flow = new Flow(this, this.req);
        this.passkey = new Passkey(this, this.req);
        this.auth.init();
    }

    regenerate() {
        // @ts-ignore
        this.req.session = {};
        this.auth.init();
        return this;
    }
}

class Auth {
    constructor(
        private readonly context: Context,
        private readonly req: RequestWithContext,
    ) {}

    init() {
        if (!this.req.session) throw new Error("Session is missing");
        if (this.req.session.isPopulated) return this;

        const iat = now();
        this.req.session = {
            session_id: uuidv4(),
            csrf: uuidv4(),
            issued_at: iat,
            touched_at: iat,
            expires_at: iat + ms2s(parseInt(process.env.GROPIUS_FLOW_EXPIRATION_TIME_MS)),
            consents: [],
        };
        return this;
    }

    setExpiration(eat: number) {
        this.req.session.expires_at = eat;
        this.req.sessionOptions.expires = new Date(eat * 1000);
        return this;
    }

    isAuthenticated() {
        return !!this.req.session.user_id;
    }

    isExpired() {
        return now() > this.req.session.expires_at;
    }

    getUserId() {
        const user = this.req.session.user_id;
        if (!user) throw new Error("User id is missing");
        return user;
    }

    setUser(user: LoginUser, activeLogin: ActiveLogin) {
        this.req.session.user_id = user.id;
        this.req.session.active_login_id = activeLogin.id;
        this.req.session.expires_at = ms2s(activeLogin.expires.getTime());
        this.req.sessionOptions.expires = activeLogin.expires;
        return this;
    }

    getActiveLoginId() {
        const id = this.req.session.active_login_id;
        if (!id) throw new Error("Active login id is missing");
        return id;
    }

    getCSRF() {
        const CSRF = this.req.session.csrf;
        if (!CSRF) throw new Error("CSRF token is missing");
        return CSRF;
    }
}

class Flow {
    constructor(
        private readonly context: Context,
        private readonly req: RequestWithContext,
    ) {}

    exists() {
        return !!this.req.session.flow?.flow_id;
    }

    assert() {
        if (!this.exists()) throw new Error("Flow does not exist");
        return this;
    }

    start(kind: FlowKind) {
        // a challenge is only ever valid within the flow it was handed out in
        this.context.passkey.clear();

        const iat = now();
        const eat = iat + ms2s(parseInt(process.env.GROPIUS_FLOW_EXPIRATION_TIME_MS));

        if (!this.context.auth.isAuthenticated()) {
            this.context.auth.setExpiration(eat);
        }

        this.req.session.flow = {
            flow_id: uuidv4(),
            issued_at: iat,
            expires_at: eat,
            state: FlowState.START,
            flow_kind: kind,
        };
        return this;
    }

    end() {
        this.context.passkey.clear();
        this.req.session.flow = undefined;
        return this;
    }

    tryId() {
        return this.req.session.flow?.flow_id;
    }

    getId() {
        const flow = this.tryId();
        if (!flow) throw new Error("Flow id is missing");
        return flow;
    }

    isExpired() {
        return now() > this.req.session.flow.expires_at;
    }

    tryRequest() {
        return this.req.session.flow?.oauth_request;
    }

    setRequest(request: OAuthAuthorizeRequest) {
        this.req.session.flow.oauth_request = request;
        return this;
    }

    getRequest() {
        const request = this.tryRequest();
        if (!request) throw new Error("Authorization request is missing");
        return request;
    }

    tryActiveLoginId() {
        return this.req.session.flow?.active_login_id;
    }

    getActiveLoginId() {
        const activeLogin = this.tryActiveLoginId();
        if (!activeLogin) throw new Error("Active login id is missing");
        return activeLogin;
    }

    setActiveLogin(activeLogin: ActiveLogin) {
        this.req.session.flow.active_login_id = activeLogin.id;
        return this;
    }

    isOAuthFlow() {
        return this.req.session.flow?.flow_kind === FlowKind.OAUTH;
    }

    isLinkFlow() {
        return this.req.session.flow?.flow_kind === FlowKind.LINK;
    }

    setVia(via: "login" | "register") {
        this.req.session.flow.via = via;
        return this;
    }

    viaLogin() {
        return this.req.session.flow?.via === "login";
    }

    viaRegister() {
        return this.req.session.flow?.via === "register";
    }

    tryStrategyTypeName() {
        return this.req.session.flow?.strategy_type_name;
    }

    getStrategyTypeName() {
        const name = this.tryStrategyTypeName();
        if (!name) throw new Error("Strategy type name is missing");
        return name;
    }

    setStrategy(strategy: Strategy) {
        this.req.session.flow.strategy_type_name = strategy.typeName;
        return this;
    }

    tryType() {
        return this.req.session.flow?.flow_type;
    }

    getType() {
        const type = this.tryType();
        if (!type) throw new Error("FlowType missing");
        return type;
    }

    setType(type: FlowType) {
        this.req.session.flow.flow_type = type;
        return this;
    }

    didConsent() {
        return this.req.session.consents.includes(this.consentFingerprint());
    }

    setGranted() {
        const fingerprint = this.consentFingerprint();
        if (!this.req.session.consents.includes(fingerprint)) {
            this.req.session.consents.push(fingerprint);
        }
        return this;
    }

    consentFingerprint() {
        const request = this.getRequest();

        const data = JSON.stringify({
            clientId: request.clientId,
            scope: request.scope,
            redirect: request.redirect,
        });

        return hash(data);
    }

    getState() {
        const state = this.req.session.flow.state;
        if (!state) throw new Error("Flow state is missing");
        return state;
    }

    setState(state: FlowState) {
        this.req.session.flow.state = state;
        return this;
    }
}

class Passkey {
    constructor(
        private readonly context: Context,
        private readonly req: RequestWithContext,
    ) {}

    /**
     * Store the challenge of a started passkey ceremony, replacing any previous one
     */
    set(challenge: Omit<PasskeyChallenge, "expires_at">) {
        this.req.session.passkey = {
            ...challenge,
            expires_at: now() + ms2s(parseInt(process.env.GROPIUS_PASSKEY_TIMEOUT_MS, 10)),
        };
        return this;
    }

    /**
     * Read the pending challenge and remove it from the session.
     *
     * A challenge may only be answered once, so it is always taken, never just read.
     * The caller has to check {@link PasskeyChallenge.expires_at}.
     */
    take(): PasskeyChallenge | undefined {
        const challenge = this.req.session.passkey;
        this.clear();
        return challenge;
    }

    /**
     * Drop a pending challenge without answering it
     */
    clear() {
        this.req.session.passkey = undefined;
        return this;
    }
}

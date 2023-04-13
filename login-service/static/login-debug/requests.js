export async function runShowInstance() {
    const r = await this.request(`login/strategy/${this.showInstanceType}/instance`);
    if (r.length <= 0) {
        return;
    }
    if (r[0].type == "userpass") {
        this.userpassLoginInstanceId = r[0].id;
    } else if (r[0].type == "github") {
        this.createGithubInstanceEditId = r[0].id;
        this.oauthFlowInstanceId = r[0].id;
        this.createGithubInstanceIsLoginActive = r[0].isLoginActive;
        this.createGithubInstanceIsSelfRegisterActive = r[0].isSelfRegisterActive;
        this.createGithubInstanceIsSyncActive = r[0].isSyncActive;
        this.createGithubInstanceDoesImplicitRegister = r[0].doesImplicitRegister;
    }
}

export async function runUserpassLogin() {
    const r = await this.request(
        `authenticate/oauth/${this.userpassLoginInstanceId}/token/${this.userpassLoginMode}`,
        "POST",
        {
            grant_type: "password",
            username: this.userpassLoginUsername,
            password: this.userpassLoginPassword,
            client_id: this.oauthFlowClientId || undefined,
            client_secret: this.oauthFlowClientSecret || undefined,
        },
    );
    if (r.access_token) {
        const token = this.jwtBodyParse(r);
        if (token.aud.includes("login-register")) {
            this.registerTokenValue = r.access_token;
        }
        if (token.aud.includes("login")) {
            this.accessToken = this.replacePrefilled ? r.access_token : this.accessToken || r.access_token;
            this.refreshToken = this.replacePrefilled ? r.refresh_token : this.refreshToken || r.refresh_token;
            this.log("Successfully logged in using userpass.");
        }
    }
}

export async function runRefreshToken() {
    const r = await this.request(`authenticate/oauth/a/token`, "POST", {
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
        client_id: this.oauthFlowClientId || undefined,
        client_secret: this.oauthFlowClientSecret || undefined,
    });
    if (!r.error && r.access_token) {
        const token = this.jwtBodyParse(r);
        if (token.aud.includes("login-register")) {
            this.registerTokenValue = r.access_token;
        }
        if (token.aud.includes("login")) {
            this.accessToken = r.access_token;
            this.refreshToken = r.refresh_token;
        }
    }
}

export async function runListAllUsers() {
    await this.request(`login/user`);
}

export async function runCreateGithubInstance() {
    const r = await this.request(
        `login/strategy/github/instance${
            this.createGithubInstanceMethod == "PUT" ? "/" + this.createGithubInstanceEditId : ""
        }`,
        this.createGithubInstanceMethod,
        {
            instanceConfig: {
                clientId: this.createGithubInstanceClientId,
                clientSecret: this.createGithubInstanceClientSecret,
            },
            isLoginActive: this.createGithubInstanceIsLoginActive,
            isSelfRegisterActive: this.createGithubInstanceIsSelfRegisterActive,
            isSyncActive: this.createGithubInstanceIsSyncActive,
            doesImplicitRegister: this.createGithubInstanceDoesImplicitRegister,
            name: this.createGithubInstanceName || undefined,
        },
    );
    this.createGithubInstanceEditId = r.id;
    this.oauthFlowInstanceId = r.id;
}

export async function runListAllClients() {
    const r = await this.request(`login/client`);
    const client = r.filter((c) => !c.requiresSecret)[0] || r[0];
    this.oauthFlowClientId = client.id;
    this.createClientEditId = client.id;
    this.createClientUrls = client.redirectUrls;
    this.createClientIsValid = client.isValid;
    this.createClientRequiresSecret = client.requiresSecret;
}

export async function runCreateClient() {
    const r = await this.request(
        `login/client${this.createClientMethod == "PUT" ? "/" + this.createClientEditId : ""}`,
        this.createClientMethod,
        {
            redirectUrls: this.createClientUrls,
            isValid: this.createClientIsValid,
            requiresSecret: this.createClientRequiresSecret,
            name: this.createClientName || undefined,
        },
    );
    this.createClientEditId = r.id;
    this.oauthFlowClientId = r.id;
}

export async function oauthFlowInitiate() {
    for (const tab of this.openedWindows) {
        if (!tab.closed) {
            tab.close();
        }
    }
    this.openedWindows.splice(0, this.openedWindows.length);
    const oauthTab = window.open(
        //eslint-disable-next-line max-len
        `${this.loginUrl}authenticate/oauth/${this.oauthFlowInstanceId}/authorize/${this.oauthFlowMode}?client_id=${this.oauthFlowClientId}`,
        "_blank",
    );
    this.openedWindows.push(oauthTab);
}

export function onMessageReceived(e) {
    const code = e.data;
    if (typeof code != "string" || code.split(".").length != 3) {
        return;
    }
    this.log(`Received code from OAuth flow:`, e.data);
    this.oauthFlowAuthorizationCode = e.data;
}

export async function oauthFlowGetToken() {
    const r = await this.request(`authenticate/oauth/${this.oauthFlowClientId}/token`, "POST", {
        grant_type: "authorization_code",
        code: this.oauthFlowAuthorizationCode,
        client_id: this.oauthFlowClientId,
        client_secret: this.oauthFlowClientSecret || undefined,
    });
    if (r.access_token) {
        const token = this.jwtBodyParse(r);
        if (token.aud.includes("login-register")) {
            this.registerTokenValue = r.access_token;
        }
        if (token.aud.includes("login")) {
            this.accessToken = this.replacePrefilled ? r.access_token : this.accessToken || r.access_token;
            this.refreshToken = this.replacePrefilled ? r.refresh_token : this.refreshToken || r.refresh_token;
            this.log("Successfully logged in using OAuth.");
        }
    }
}

export async function runRegisterDataSuggestion() {
    const r = await this.request(`login/registration/data-suggestion`, "POST", {
        register_token: this.registerTokenValue,
    });
    this.registerNewUsername = r.username || "";
    this.registerNewDisplayName = r.displayName || "";
    this.registerNewEmail = r.email || "";
}

export async function runRegister() {
    let body = {
        register_token: this.registerTokenValue,
    };
    if (this.registerType == "self-register") {
        body.username = this.registerNewUsername;
        body.displayName = this.registerNewDisplayName;
        body.email = this.registerNewEmail;
    } else if (this.registerType == "admin-link") {
        body.userIdToLink = this.registerAdminLinkUserId;
    }
    await this.request(`login/registration/${this.registerType}`, "POST", body);
}

export function storeToStorage() {
    localStorage.setItem(
        "gropius-login-debug",
        JSON.stringify({
            host: this.hostname,
            accessToken: this.accessToken || "",
            refreshToken: this.refreshToken,
        }),
    );
}

export const allMethods = {
    runShowInstance,
    runUserpassLogin,
    runRefreshToken,
    runListAllUsers,
    runCreateGithubInstance,
    runListAllClients,
    runCreateClient,
    oauthFlowInitiate,
    onMessageReceived,
    oauthFlowGetToken,
    runRegisterDataSuggestion,
    runRegister,
    storeToStorage,
};

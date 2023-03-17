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
    const r = await this.request(`authenticate/oauth/${this.userpassLoginInstanceId}/token`, "POST", {
        grant_type: "password",
        username: this.userpassLoginUsername,
        password: this.userpassLoginPassword,
    });
    this.accessToken = r.access_token;
    this.refreshTokenValue = r.refresh_token;
}

export async function runRefreshToken() {
    const r = await this.request(`authenticate/oauth/a/token`, "POST", {
        grant_type: "refresh_token",
        refresh_token: this.refreshTokenValue,
    });
    this.accessToken = r.access_token;
    this.refreshTokenValue = r.refresh_token;
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
    this.createClientRedirectUrls = client.redirectUrls.join(";");
    this.createClientIsValid = client.isValid;
    this.createClientRequiresSecret = client.requiresSecret;
}

export async function runCreateClient() {
    const r = await this.request(
        `login/client${this.createClientMethod == "PUT" ? "/" + this.createClientEditId : ""}`,
        this.createClientMethod,
        {
            redirectUrls: createClientRedirectUrls,
            isValid: this.createClientIsValid,
            requiresSecret: this.createClientRequiresSecret,
        },
    );
    this.createClientEditId = r.id;
    this.oauthFlowClientId = r.id;
}

export async function oauthFlowGetToken() {
    const r = await this.request(`authenticate/oauth/${this.oauthFlowClientId}/token`, "POST", {
        grant_type: "authorization_code",
        code: this.oauthFlowAuthorizationCode,
    });
    if (r.access_token && r.scope.includes("login-register")) {
        this.registerTokenValue = r.access_token;
    }
}

export async function runRegister() {
    const r = await this.request(`authenticate/oauth/a/token`, "POST", {
        grant_type: "refresh_token",
        refresh_token: this.refreshTokenValue,
    });
    this.accessToken = r.access_token;
    this.refreshTokenValue = r.refresh_token;
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
    oauthFlowGetToken,
    runRegister,
    storeToStorage,
};

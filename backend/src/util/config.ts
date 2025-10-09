const config = {
    trustProxy: process.env.GROPIUS_LOGIN_TRUST_PROXY ?? false,
    cookieSecret: process.env.GROPIUS_LOGIN_SESSION_SECRET ?? "SOME_SECRET",
    cookieSecure: (process.env.GROPIUS_LOGIN_COOKIE_SECURE ?? "false") === "true",
};

if (config.cookieSecret === "SOME_SECRET") {
    console.warn("GROPIUS_LOGIN_SESSION_SECRET is set to the default");
}

if (!config.trustProxy && config.cookieSecure) {
    console.warn(
        "GROPIUS_LOGIN_COOKIE_SECURE is set to true but GROPIUS_LOGIN_TRUST_PROXY is not set to true. This may cause issues if you are behind a proxy.",
    );
}

export default config;

import { allMethods } from "./requests.js";

export default {
    components: {},
    watch: {
        hostname: {
            handler(newVal, oldVal) {
                this.loginUrl = this.hostname + ":3000/";
                if (newVal != "http://localhost") {
                    this.storeToStorage();
                }
            },
            immediate: true,
        },
        accessToken: {
            handler(newVal) {
                if (newVal != "") {
                    this.storeToStorage();
                }
            },
        },
        refreshToken: {
            handler(newVal) {
                if (newVal != "") {
                    this.storeToStorage();
                }
            },
        },
    },
    created() {
        const stored = JSON.parse(localStorage.getItem("gropius-login-debug") || "{}");
        this.hostname = stored.host || "http://localhost";
        this.accessToken = stored.accessToken || "";
        this.refreshToken = stored.refreshToken || "";
    },
    methods: {
        ...allMethods,

        createClientUrlsInput(e) {
            this.createClientUrls = (e.target.value || "").split(";").map((url) => url.trim());
        },
        log(...data) {
            data = data.filter((d) => !!d);
            if (this.outputLocation.includes("console")) {
                console.log(...data.map((d) => (typeof d == "string" ? d + "\n" : d)));
            }
            if (this.outputLocation.includes("textarea")) {
                this.logData +=
                    data.map((d) => (typeof d == "object" ? JSON.stringify(d, undefined, 4) : d)).join("\n") + "\n\n";
            }
            if (this.outputLocation.includes("alert")) {
                alert(data.map((d) => (typeof d == "object" ? JSON.stringify(d, undefined, 4) : d)).join("\n"));
            }
        },

        getAccessTokenStrInfo(json) {
            if (json.access_token) {
                try {
                    const decoded = JSON.parse(atob(json.access_token.split(".")[1]));
                    return `Returned access token scope ${decoded.aud.join(",")} valid until ${new Date(
                        decoded.exp * 1000,
                    ).toISOString()}`;
                } catch (e) {
                    console.warn("Error parsing jwt", e);
                }
            }
            return undefined;
        },

        async request(url, method = "GET", body = undefined, token = this.accessToken) {
            let headers = {};
            if (body) {
                headers = { ...headers, "content-type": "application/json" };
            }
            if (token) {
                headers = { ...headers, authorization: "Bearer " + token };
            }
            const res = await fetch(this.loginUrl + url, {
                headers,
                method: method,
                body: JSON.stringify(body),
            });
            if (res.status <= 299 || res.status >= 200) {
                if (res.headers.get("content-type").startsWith("application/json")) {
                    const json = await res.json();
                    this.log(`${method} ${this.loginUrl}${url}`, json, this.getAccessTokenStrInfo(json));
                    return json;
                } else {
                    this.log(`${method} ${this.loginUrl}${url} did not return JSON?!`);
                    throw new Error();
                }
            } else {
                if (res.headers.get("content-type").startsWith("application/json")) {
                    this.log(`${method} ${this.loginUrl}${url} failed with code ${res.status}`, await res.json());
                    throw new Error();
                } else {
                    this.log(`${method} ${this.loginUrl}${url} failed with code ${res.status}`, res.statusText);
                    throw new Error();
                }
            }
        },
    },
    data() {
        return {
            hostname: "http://localhost",
            loginUrl: "",
            accessToken: "",
            refreshToken: "",
            outputLocation: "console",
            logData: "",

            showInstanceType: "userpass",

            userpassLoginInstanceId: "",
            userpassLoginUsername: "",
            userpassLoginPassword: "",

            createGithubInstanceMethod: "POST",
            createGithubInstanceEditId: "",
            createGithubInstanceClientId: "",
            createGithubInstanceClientSecret: "",
            createGithubInstanceIsLoginActive: false,
            createGithubInstanceIsSelfRegisterActive: false,
            createGithubInstanceIsSyncActive: false,
            createGithubInstanceDoesImplicitRegister: false,

            createClientMethod: "PUT",
            createClientEditId: "",
            createClientUrls: [],
            createClientIsValid: true,
            createClientRequiresSecret: false,

            oauthFlowInstanceId: "",
            oauthFlowClientId: "",
            oauthFlowMode: "register",
            oauthFlowAuthorizationCode: "",

            registerType: "self-link",
            registerTokenValue: "",
            registerNewUsername: "",
            registerNewDisplayName: "",
            registerNewEmail: "",
            registerAdminLinkUserId: "",
        };
    },
};

import { allMethods } from "./requests.js";

export default {
    components: {},
    watch: {
        hostname: {
            handler(newVal, oldVal) {
                this.loginUrl = this.hostname + "/";
                if (newVal != oldVal && newVal != window.location.origin) {
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
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.has("code")) {
            const oauthCode = currentUrl.searchParams.get("code");
            currentUrl.searchParams.delete("code");
            if (window.opener) {
                window.opener.postMessage(oauthCode);
                window.close();
                return;
            } else {
                oauthFlowAuthorizationCode = oauthCode;
                window.history.replaceState(history.state, document.title, currentUrl);
            }
        }

        const stored = JSON.parse(localStorage.getItem("gropius-login-debug") || "{}");
        this.hostname = stored.host || this.hostname;
        this.accessToken = stored.accessToken || "";
        this.refreshToken = stored.refreshToken || "";
    },
    mounted() {
        window.addEventListener("message", this.onMessageReceived);
        window.request = this.request.bind(this);
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

        jwtBodyParse(json) {
            return JSON.parse(atob(json.access_token.split(".")[1]));
        },

        getAccessTokenStrInfo(json) {
            if (json.access_token) {
                try {
                    const decoded = this.jwtBodyParse(json);
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
            if (url.startsWith("/")) {
                url = url.substring(1);
            }
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
            hostname: window.location.origin,
            loginUrl: "",
            replacePrefilled: true,
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
            createGithubInstanceName: "",

            createClientMethod: "PUT",
            createClientEditId: "",
            createClientUrls: [window.location.href],
            createClientIsValid: true,
            createClientRequiresSecret: false,
            createClientName: "",

            oauthFlowInstanceId: "",
            oauthFlowClientId: "",
            oauthFlowMode: "login",
            oauthFlowAuthorizationCode: "",
            openedWindows: [],

            registerType: "self-register",
            registerTokenValue: "",
            registerNewUsername: "",
            registerNewDisplayName: "",
            registerNewEmail: "",
            registerAdminLinkUserId: "",
        };
    },
};

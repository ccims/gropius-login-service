export default {
    mounted() {
        this.loadInstances();
    },
    methods: {
        async loadInstances() {
            const instances = await this.request("/login/strategyInstance");
            this.availableInstances = instances;
            if (this.selectedInstance === undefined) {
                this.selectedInstance = this.availableInstances[0].id;
            }
        },
        async request(url, method = "GET", body = undefined, token = undefined) {
            let headers = {};
            if (body) {
                headers = { ...headers, "content-type": "application/json" };
            }
            if (token) {
                headers = { ...headers, authorization: "Bearer " + token };
            }
            const res = await fetch(url, {
                headers,
                method: method,
                body: JSON.stringify(body),
            });
            if (res.status <= 299 || res.status >= 200) {
                if (res.headers.get("content-type").startsWith("application/json")) {
                    const json = await res.json();
                    return json;
                }
            }
            throw new Error();
        },
    },
    data() {
        return {
            selectedInstance: undefined,
            availableInstances: [],
        };
    },
};

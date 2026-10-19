import "reflect-metadata";
import { test } from "node:test";
import assert from "node:assert/strict";
import { sealToken, openToken } from "../dist/strategies/gitlab-token/token-vault.js";
import { GitlabTokenStrategyService } from "../dist/strategies/gitlab-token/gitlab-token.service.js";
import { ImsUserFindingService } from "../dist/backend-services/ims-user-finding.service.js";

test("numeric GitLab identities produce a string display name when creating an IMS user", async () => {
    const service = new ImsUserFindingService(
        {
            async request(_query, { input }) {
                assert.equal(input.displayName, "91999");
                assert.deepEqual(input.templatedFields, [{ name: "gitlab-user-id", value: 91999 }]);
                return { createIMSUser: { imsUser: { id: "created-user" } } };
            },
        },
        {
            getStrategyByName() {
                return {
                    getImsUserTemplatedValuesForLoginData() {
                        return { "gitlab-user-id": 91999 };
                    },
                };
            },
        },
        {},
        {},
        {},
    );
    const id = await service.createNewImsUserInBackendForLoginDataAndIms(
        { strategyInstance: Promise.resolve({ type: "gitlab-token" }) },
        "test-ims",
    );
    assert.equal(id, "created-user");
});

test("GitLab PATs are authenticated-encrypted and reject tampering", () => {
    process.env.GROPIUS_GITLAB_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
    const encrypted = sealToken("fixture-token");
    assert.ok(!encrypted.includes("fixture-token"));
    assert.equal(openToken(encrypted), "fixture-token");
    const parts = encrypted.split(":");
    parts[3] = Buffer.from("tampered").toString("base64");
    assert.throws(() => openToken(parts.join(":")));
    process.env.GROPIUS_GITLAB_TOKEN_ENCRYPTION_KEY = "";
    assert.throws(() => sealToken("fixture-token"));
});

test("GitLab credential linking and token rotation use numeric identity", async () => {
    process.env.GROPIUS_GITLAB_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 8).toString("base64");
    let saved = false;
    const strategy = new GitlabTokenStrategyService(
        { addStrategy() {} },
        {},
        {
            async save() {
                saved = true;
            },
        },
    );
    const instance = { instanceConfig: { imsTemplatedFieldsFilter: { "gitlab-url": "https://gitlab.example.test" } } };
    const previous = globalThis.fetch;
    let userId = 42;
    globalThis.fetch = async (url, options) => {
        assert.equal(url, "https://gitlab.example.test/api/v4/user");
        assert.equal(options.redirect, "error");
        assert.equal(options.headers["PRIVATE-TOKEN"], "fixture-token");
        return Response.json({ id: userId, username: "student" });
    };
    try {
        const queryAuth = await strategy.performAuth(instance, undefined, { query: { token: "fixture-token" } }, {});
        assert.equal(queryAuth.result, null, "credentials in URL parameters must not authenticate");
        const auth = await strategy.performAuth(instance, undefined, { body: { token: "fixture-token" } }, {});
        const data = { data: auth.result.dataUserLoginData, strategyInstance: Promise.resolve(instance) };
        assert.equal(data.data.token, undefined);
        assert.deepEqual(strategy.getImsUserTemplatedValuesForLoginData(data), { "gitlab-user-id": 42 });
        assert.equal((await strategy.getSyncDataForLoginData(data)).token, "fixture-token");
        await strategy.handleAction(data, "update-token", { token: "fixture-token" });
        assert.equal(saved, true);
        userId = 99;
        await assert.rejects(
            strategy.handleAction(data, "update-token", { token: "fixture-token" }),
            /another GitLab account/,
        );
    } finally {
        globalThis.fetch = previous;
    }
});

test("GitLab validation fails safely without replacing credentials when the instance is unavailable", async () => {
    let saves = 0;
    const strategy = new GitlabTokenStrategyService(
        { addStrategy() {} },
        {},
        {
            async save() {
                saves++;
            },
        },
    );
    const instance = { instanceConfig: { imsTemplatedFieldsFilter: { "gitlab-url": "https://gitlab.example.test" } } };
    const original = { gitlabUserId: 42, encryptedToken: "existing-credential" };
    const data = { data: original, strategyInstance: Promise.resolve(instance) };
    const previous = globalThis.fetch;
    try {
        for (const response of [
            async () => {
                throw new TypeError("Network unavailable");
            },
            async () => new Response("not JSON"),
            async () => Response.json(null),
            async () => Response.json({ id: "42", username: "student" }),
            async () => new Response(null, { status: 401 }),
        ]) {
            globalThis.fetch = response;
            const auth = await strategy.performAuth(instance, undefined, { body: { token: "fixture-token" } }, {});
            assert.equal(auth.result, null);
            await assert.rejects(
                strategy.handleAction(data, "update-token", { token: "fixture-token" }),
                /Token invalid/,
            );
            assert.equal(data.data, original);
        }
        assert.equal(saves, 0);
    } finally {
        globalThis.fetch = previous;
    }
});

import "reflect-metadata";
import { test } from "node:test";
import assert from "node:assert/strict";
import { sealToken, openToken } from "../dist/strategies/gitlab-token/token-vault.js";
import { GitlabTokenStrategyService } from "../dist/strategies/gitlab-token/gitlab-token.service.js";

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
        const auth = await strategy.performAuth(instance, undefined, { query: { token: "fixture-token" } }, {});
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

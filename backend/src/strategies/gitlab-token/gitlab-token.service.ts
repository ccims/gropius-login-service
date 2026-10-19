import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Strategy, type PerformAuthResult, type StrategyUpdateAction, type StrategyVariable } from "../Strategy.js";
import { StrategyInstance } from "../../model/postgres/StrategyInstance.entity.js";
import { UserLoginData } from "../../model/postgres/UserLoginData.entity.js";
import { StrategiesService } from "../../model/services/strategies.service.js";
import { StrategyInstanceService } from "../../model/services/strategy-instance.service.js";
import { UserLoginDataService } from "../../model/services/user-login-data.service.js";
import type { Context } from "../../util/Context.js";
import type { Schema } from "jtd";
import type { Request, Response } from "express";
import { openToken, sealToken } from "./token-vault.js";

@Injectable()
export class GitlabTokenStrategyService extends Strategy {
    constructor(
        strategies: StrategiesService,
        instances: StrategyInstanceService,
        private readonly loginData: UserLoginDataService,
    ) {
        super("gitlab-token", instances, strategies, false, true, false, false, false);
    }

    override get instanceConfigSchema(): Record<string, Schema> {
        return { imsTemplatedFieldsFilter: { properties: { "gitlab-url": { type: "string" } } } };
    }

    protected override checkAndExtendInstanceConfig(config: object): object {
        const value = structuredClone(config);
        const url = new URL(value["imsTemplatedFieldsFilter"]?.["gitlab-url"]);
        if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.search || url.hash)
            throw new Error("gitlab-url must be an HTTP(S) GitLab instance base URL");
        value["imsTemplatedFieldsFilter"]["gitlab-url"] = url.href.replace(/\/$/, "");
        return super.checkAndExtendInstanceConfig(value);
    }

    override get acceptsVariables(): StrategyVariable[] {
        return [{ name: "token", displayName: "GitLab personal access token", type: "password" }];
    }
    override get updateActions(): StrategyUpdateAction[] {
        return [{ name: "update-token", displayName: "Update GitLab token", variables: this.acceptsVariables }];
    }
    override async getSyncDataForLoginData(data: UserLoginData): Promise<{ token: string | null }> {
        return { token: data.data.encryptedToken ? openToken(data.data.encryptedToken) : null };
    }
    override getImsUserTemplatedValuesForLoginData(data: UserLoginData): object {
        // Match on stable numeric identity only, so a username change cannot split an account.
        return { "gitlab-user-id": data.data.gitlabUserId };
    }
    override getLoginDataDataForImsUserTemplatedFields(user: object): object {
        return { gitlabUserId: user["gitlab-user-id"] };
    }
    override async getLoginDataDescription(data: UserLoginData): Promise<string> {
        return data.data.username;
    }
    override getCensoredInstanceConfig(instance: StrategyInstance): object {
        return { imsTemplatedFieldsFilter: instance.instanceConfig["imsTemplatedFieldsFilter"] };
    }

    private async verify(token: unknown, instance: StrategyInstance) {
        if (typeof token !== "string" || !token.length) return null;
        const root = instance.instanceConfig["imsTemplatedFieldsFilter"]["gitlab-url"];
        let user: { id?: unknown; username?: unknown };
        try {
            const response = await fetch(`${root}/api/v4/user`, {
                headers: { "PRIVATE-TOKEN": token },
                redirect: "error",
                signal: AbortSignal.timeout(15000),
            });
            if (!response.ok) return null;
            const value: unknown = await response.json();
            if (value === null || typeof value !== "object") return null;
            user = value;
        } catch {
            // An unreachable instance or malformed response must not create or replace a credential.
            return null;
        }
        if (typeof user.id !== "number" || !Number.isSafeInteger(user.id) || user.id <= 0) return null;
        if (typeof user.username !== "string") return null;
        return { gitlabUserId: user.id as number, username: user.username as string, encryptedToken: sealToken(token) };
    }

    override async performAuth(
        instance: StrategyInstance,
        _context: Context | undefined,
        req: Request,
        _res: Response,
    ): Promise<PerformAuthResult> {
        const value = await this.verify(req.query["token"], instance);
        if (!value) {
            return { result: null, returnedState: {}, info: { message: "GitLab token invalid or unavailable" } };
        }
        return {
            result: { dataActiveLogin: {}, dataUserLoginData: value, mayRegister: true },
            returnedState: {},
            info: {},
        };
    }

    override async handleAction(data: UserLoginData, name: string, input: Record<string, unknown>): Promise<void> {
        if (name !== "update-token") throw new HttpException("Unknown action", HttpStatus.BAD_REQUEST);
        const value = await this.verify(input.token, await data.strategyInstance);
        if (!value || value.gitlabUserId !== data.data.gitlabUserId)
            throw new HttpException("Token invalid or belongs to another GitLab account", HttpStatus.BAD_REQUEST);
        data.data = value;
        await this.loginData.save(data);
    }
}

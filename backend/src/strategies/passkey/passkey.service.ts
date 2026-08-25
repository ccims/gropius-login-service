import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import {
    generateAuthenticationOptions,
    generateRegistrationOptions,
    verifyAuthenticationResponse,
    verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
    AuthenticationResponseJSON,
    AuthenticatorTransportFuture,
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
    RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { generateUserID, isoBase64URL, isoUint8Array } from "@simplewebauthn/server/helpers";
import type { Schema } from "jtd";
import type { Request } from "express";
import { AuthException } from "../../errors/AuthException.js";
import { LoginUser } from "../../model/postgres/LoginUser.entity.js";
import { StrategyInstance } from "../../model/postgres/StrategyInstance.entity.js";
import { UserLoginData } from "../../model/postgres/UserLoginData.entity.js";
import { StrategiesService } from "../../model/services/strategies.service.js";
import { StrategyInstanceService } from "../../model/services/strategy-instance.service.js";
import { UserLoginDataService } from "../../model/services/user-login-data.service.js";
import { checkType } from "../../util/checkType.js";
import { Context, type PasskeyChallenge } from "../../util/Context.js";
import { now } from "../../util/utils.js";
import { FlowType } from "../AuthResult.js";
import { Strategy, type PerformAuthResult, type StrategyUpdateAction, type StrategyVariable } from "../Strategy.js";

/**
 * The user verification requirements a passkey strategy instance can be configured with.
 */
const USER_VERIFICATION_REQUIREMENTS = ["required", "preferred", "discouraged"] as const;

type UserVerificationRequirement = (typeof USER_VERIFICATION_REQUIREMENTS)[number];

/**
 * The relying party a ceremony of one strategy instance runs for.
 */
interface RelyingParty {
    /**
     * The relying party id, i.e. the domain the credential is scoped to.
     * A credential created for this id can only be used on this domain and its subdomains.
     */
    id: string;

    /**
     * The human readable name of the relying party, displayed by the authenticator
     */
    name: string;

    /**
     * The origins a ceremony may be performed on. Usually exactly one.
     */
    origins: string[];

    /**
     * Whether the authenticator has to verify the user (PIN, biometrics, ...).
     * Since a passkey is the only factor, this defaults to "required".
     */
    userVerification: UserVerificationRequirement;
}

/**
 * The data stored in the `data` field of a {@link UserLoginData} of this strategy.
 *
 * Everything in here is public information: the public key half of the credential,
 * the identifiers needed to find it again and the counters needed to detect cloned authenticators.
 */
interface PasskeyLoginData {
    /**
     * The base64url encoded credential id, unique per credential and used to look the passkey up
     */
    credentialId: string;

    /**
     * The base64url encoded COSE public key of the credential, used to verify assertions
     */
    publicKey: string;

    /**
     * The signature counter reported by the authenticator on the last successful ceremony.
     * A counter that does not increase indicates a cloned authenticator.
     */
    counter: number;

    /**
     * The ways the authenticator can be reached, used as a hint for the browser
     */
    transports?: AuthenticatorTransportFuture[];

    /**
     * The base64url encoded user handle the credential was created for
     */
    userHandle?: string;

    /**
     * The authenticator model identifier, if the authenticator provided one
     */
    aaguid?: string;

    /**
     * Whether the credential can be used on more than one device (i.e. is synced)
     */
    deviceType?: string;

    /**
     * Whether a multi device credential is currently backed up
     */
    backedUp?: boolean;

    /**
     * The user chosen name of the passkey, shown in the account overview
     */
    label: string;

    /**
     * The username the user asked for while registering, used as registration suggestion only
     */
    username?: string;
}

/**
 * Strategy for authenticating users with passkeys (WebAuthn discoverable credentials).
 *
 * Unlike the other credential strategies, authenticating is a two step ceremony:
 * the client first asks for a challenge (see `PasskeyController`), lets the authenticator
 * sign it and only then submits the result to the regular submit endpoint,
 * where {@link performAuth} verifies it.
 *
 * Credentials are always created as discoverable (resident) credentials, so that logging in
 * does not need a username: the authenticator tells us which credential was used.
 */
@Injectable()
export class PasskeyStrategyService extends Strategy {
    private readonly logger = new Logger(PasskeyStrategyService.name);

    constructor(
        strategiesService: StrategiesService,
        strategyInstanceService: StrategyInstanceService,
        private readonly loginDataService: UserLoginDataService,
    ) {
        super("passkey", strategyInstanceService, strategiesService, true, false, false, false, false, true);
    }

    override get acceptsVariables(): StrategyVariable[] {
        return [
            {
                name: "credential",
                displayName: "Passkey credential",
                type: "object",
            },
        ];
    }

    override get updateActions(): StrategyUpdateAction[] {
        return [
            {
                name: "rename",
                displayName: "Rename passkey",
                variables: [
                    {
                        name: "label",
                        displayName: "Name",
                        type: "string",
                    },
                ],
            },
        ];
    }

    override get instanceConfigSchema(): Record<string, Schema> {
        return {
            rpName: { type: "string", nullable: true },
            rpId: { type: "string", nullable: true },
            origin: { type: "string", nullable: true },
            userVerification: { enum: [...USER_VERIFICATION_REQUIREMENTS], nullable: true },
        };
    }

    /**
     * Checks the config of a passkey strategy instance.
     *
     * All parameters are optional and fall back to the deployment wide configuration,
     * which in turn is derived from `GROPIUS_ENDPOINT`. They only need to be given if a single
     * deployment serves passkeys for more than one relying party.
     *
     * - rpId: The domain credentials are scoped to. Optional, default: `GROPIUS_PASSKEY_RP_ID`
     * - rpName: The name the authenticator displays. Optional, default: `GROPIUS_PASSKEY_RP_NAME`
     * - origin: Comma separated list of origins ceremonies may run on. Optional, default: `GROPIUS_PASSKEY_ORIGIN`
     * - userVerification: One of "required", "preferred", "discouraged".
     *     Optional, default: `GROPIUS_PASSKEY_USER_VERIFICATION`
     *
     * @param instanceConfig The instance config for a passkey strategy instance to check
     * @returns The config as it should be stored on the instance
     */
    protected override checkAndExtendInstanceConfig(instanceConfig: object): object {
        const resultingConfig = {};
        try {
            resultingConfig["rpId"] = checkType(instanceConfig, "rpId", "string", true);
            resultingConfig["rpName"] = checkType(instanceConfig, "rpName", "string", true);
            resultingConfig["origin"] = checkType(instanceConfig, "origin", "string", true);
            resultingConfig["userVerification"] = checkType(instanceConfig, "userVerification", "string", true);
        } catch (err: any) {
            throw new Error("Instance config for passkey instance invalid: " + err.message);
        }

        const userVerification = resultingConfig["userVerification"];
        if (userVerification && !USER_VERIFICATION_REQUIREMENTS.includes(userVerification)) {
            throw new Error(
                `Instance config for passkey instance invalid: userVerification must be one of ` +
                    USER_VERIFICATION_REQUIREMENTS.join(", "),
            );
        }

        for (const origin of this.splitOrigins(resultingConfig["origin"])) {
            // throws if the origin is not a valid URL
            new URL(origin);
        }

        return super.checkAndExtendInstanceConfig(resultingConfig);
    }

    /**
     * Returns the *configured* relying party of the instance, not the effective one.
     *
     * A field that is not set inherits the deployment configuration on every request, and this
     * is what the admin UI edits, so returning the resolved values here would turn opening the
     * edit dialog and saving it into pinning them onto the instance. Changing the rpId of an
     * instance invalidates every passkey registered on it, so it must never happen implicitly.
     */
    override getCensoredInstanceConfig(instance: StrategyInstance): object {
        return {
            rpId: instance.instanceConfig["rpId"],
            rpName: instance.instanceConfig["rpName"],
            origin: instance.instanceConfig["origin"],
            userVerification: instance.instanceConfig["userVerification"],
        };
    }

    override getUserDataSuggestion(loginData: UserLoginData): {
        username?: string;
        displayName?: string;
        email?: string;
    } {
        return {
            username: loginData.data?.username?.trim(),
        };
    }

    override async getLoginDataDescription(loginData: UserLoginData): Promise<string> {
        return loginData.data?.label ?? "Passkey";
    }

    override async handleAction(loginData: UserLoginData, name: string, data: Record<string, any>): Promise<void> {
        if (name !== "rename") {
            throw new HttpException("Unknown action", HttpStatus.BAD_REQUEST);
        }

        const label = typeof data.label === "string" ? data.label.trim() : "";
        if (label.length == 0) {
            throw new HttpException("Name cannot be empty or blank!", HttpStatus.BAD_REQUEST);
        }
        if (label.length > 64) {
            throw new HttpException("Name cannot be longer than 64 characters!", HttpStatus.BAD_REQUEST);
        }

        loginData.data = { ...loginData.data, label };
        await this.loginDataService.save(loginData);
    }

    /**
     * Creates the options for `navigator.credentials.create(...)`, i.e. for adding a new passkey,
     * and remembers the challenge on the session until it is used by {@link performAuth}.
     *
     * If the user is already authenticated (linking an additional passkey to an existing account),
     * the passkey is created for that account and their existing passkeys are excluded,
     * so the same authenticator cannot register twice for one account.
     *
     * @param instance The passkey strategy instance the passkey should be registered on
     * @param context The context of the request, the challenge is stored on its session
     * @param user The user the passkey is registered for, if they are already known
     * @param requestedUsername The username the user asked for, shown by the authenticator
     * @returns The creation options to hand to the browser
     */
    async createRegistrationOptions(
        instance: StrategyInstance,
        context: Context,
        user?: LoginUser,
        requestedUsername?: string,
    ): Promise<PublicKeyCredentialCreationOptionsJSON> {
        const relyingParty = this.getRelyingParty(instance);
        const username = user?.username ?? requestedUsername?.trim();
        const existingLoginData = user ? await this.findLoginDataOfUser(instance, user) : [];

        const options = await generateRegistrationOptions({
            rpID: relyingParty.id,
            rpName: relyingParty.name,
            // the user handle must not contain personal information, so it is either the
            // (opaque) id of the existing account or a fresh random value for a new one
            userID: user ? isoUint8Array.fromUTF8String(user.id) : await generateUserID(),
            userName: username || `${relyingParty.name} user`,
            userDisplayName: username ?? "",
            attestationType: "none",
            timeout: this.getTimeout(),
            excludeCredentials: existingLoginData.map((loginData) => ({
                id: (loginData.data as PasskeyLoginData).credentialId,
                transports: (loginData.data as PasskeyLoginData).transports,
            })),
            authenticatorSelection: {
                // discoverable credentials are what makes logging in without a username possible
                residentKey: "required",
                requireResidentKey: true,
                userVerification: relyingParty.userVerification,
            },
        });

        context.passkey.set({
            kind: "registration",
            challenge: options.challenge,
            strategy_instance_id: instance.id,
            user_handle: options.user.id,
            username: username || undefined,
        });

        return options;
    }

    /**
     * Creates the options for `navigator.credentials.get(...)`, i.e. for logging in with a passkey,
     * and remembers the challenge on the session until it is used by {@link performAuth}.
     *
     * No credentials are listed, so the authenticator offers the user every passkey it holds
     * for this relying party and we learn the account from the credential it returns.
     *
     * @param instance The passkey strategy instance to authenticate against
     * @param context The context of the request, the challenge is stored on its session
     * @returns The request options to hand to the browser
     */
    async createAuthenticationOptions(
        instance: StrategyInstance,
        context: Context,
    ): Promise<PublicKeyCredentialRequestOptionsJSON> {
        const relyingParty = this.getRelyingParty(instance);

        const options = await generateAuthenticationOptions({
            rpID: relyingParty.id,
            userVerification: relyingParty.userVerification,
            timeout: this.getTimeout(),
        });

        context.passkey.set({
            kind: "authentication",
            challenge: options.challenge,
            strategy_instance_id: instance.id,
        });

        return options;
    }

    public override async performAuth(
        strategyInstance: StrategyInstance,
        context: Context | undefined,
        req: Request,
        res: any,
    ): Promise<PerformAuthResult> {
        if (!context) {
            throw new AuthException("Passkeys can only be used within a flow", strategyInstance.id);
        }

        // the challenge is taken, not read: a challenge may only ever be answered once,
        // no matter whether answering it succeeds
        const challenge = context.passkey.take();
        if (!challenge) {
            throw new AuthException("No passkey was requested for this session", strategyInstance.id);
        }
        if (challenge.strategy_instance_id !== strategyInstance.id) {
            throw new AuthException("The passkey was requested for a different login method", strategyInstance.id);
        }
        if (now() > challenge.expires_at) {
            throw new AuthException("The passkey request expired, please try again", strategyInstance.id);
        }

        const isLogin = context.flow.getType() == FlowType.LOGIN;
        if (isLogin !== (challenge.kind == "authentication")) {
            throw new AuthException("The passkey was requested for a different purpose", strategyInstance.id);
        }

        const credential = this.parseCredential(strategyInstance, req);
        return isLogin
            ? this.verifyAuthentication(strategyInstance, challenge, credential)
            : this.verifyRegistration(strategyInstance, challenge, credential);
    }

    /**
     * Verifies a newly created passkey and returns it as the login data to register with.
     */
    private async verifyRegistration(
        instance: StrategyInstance,
        challenge: PasskeyChallenge,
        credential: RegistrationResponseJSON,
    ): Promise<PerformAuthResult> {
        const relyingParty = this.getRelyingParty(instance);

        let verification: Awaited<ReturnType<typeof verifyRegistrationResponse>>;
        try {
            verification = await verifyRegistrationResponse({
                response: credential,
                expectedChallenge: challenge.challenge,
                expectedOrigin: relyingParty.origins,
                expectedRPID: relyingParty.id,
                requireUserVerification: relyingParty.userVerification == "required",
            });
        } catch (err: any) {
            this.logger.warn("Passkey registration could not be verified", err);
            throw new AuthException(`Could not register passkey: ${err.message}`, instance.id);
        }
        if (!verification.verified) {
            throw new AuthException("Could not register passkey", instance.id);
        }

        const registrationInfo = verification.registrationInfo;
        const credentialId = registrationInfo.credential.id;

        const alreadyRegistered = await this.loginDataService.findForStrategyWithDataContaining(instance, {
            credentialId,
        });
        if (alreadyRegistered.length > 0) {
            throw new AuthException("This passkey is already registered", instance.id);
        }

        const dataUserLoginData: PasskeyLoginData = {
            credentialId,
            publicKey: isoBase64URL.fromBuffer(registrationInfo.credential.publicKey),
            counter: registrationInfo.credential.counter,
            transports: registrationInfo.credential.transports ?? [],
            userHandle: challenge.user_handle,
            aaguid: registrationInfo.aaguid,
            deviceType: registrationInfo.credentialDeviceType,
            backedUp: registrationInfo.credentialBackedUp,
            label: "Passkey",
            username: challenge.username,
        };

        return {
            result: { dataActiveLogin: {}, dataUserLoginData, mayRegister: true },
            returnedState: {},
            info: {},
        };
    }

    /**
     * Verifies an assertion of an existing passkey and returns the login data it belongs to.
     */
    private async verifyAuthentication(
        instance: StrategyInstance,
        challenge: PasskeyChallenge,
        credential: AuthenticationResponseJSON,
    ): Promise<PerformAuthResult> {
        const relyingParty = this.getRelyingParty(instance);

        if (!credential.id || typeof credential.id !== "string") {
            throw new AuthException("The passkey did not identify itself", instance.id);
        }

        const loginDataCandidates = await this.loginDataService.findForStrategyWithDataContaining(instance, {
            credentialId: credential.id,
        });
        if (loginDataCandidates.length != 1) {
            this.logger.debug("Passkey login didn't find unique login data", loginDataCandidates);
            throw new AuthException("Unknown passkey", instance.id);
        }
        const loginData = loginDataCandidates[0];
        const storedData = loginData.data as PasskeyLoginData;

        // if the authenticator reports a user handle it has to be the one the credential was created for
        const userHandle = credential.response?.userHandle;
        if (userHandle && storedData.userHandle && userHandle !== storedData.userHandle) {
            throw new AuthException("The passkey belongs to a different account", instance.id);
        }

        let verification: Awaited<ReturnType<typeof verifyAuthenticationResponse>>;
        try {
            verification = await verifyAuthenticationResponse({
                response: credential,
                expectedChallenge: challenge.challenge,
                expectedOrigin: relyingParty.origins,
                expectedRPID: relyingParty.id,
                requireUserVerification: relyingParty.userVerification == "required",
                credential: {
                    id: storedData.credentialId,
                    publicKey: isoBase64URL.toBuffer(storedData.publicKey),
                    counter: storedData.counter ?? 0,
                    transports: storedData.transports,
                },
            });
        } catch (err: any) {
            this.logger.warn("Passkey assertion could not be verified", err);
            throw new AuthException(`Could not login with passkey: ${err.message}`, instance.id);
        }
        if (!verification.verified) {
            throw new AuthException("Could not login with passkey", instance.id);
        }

        // the counter has to be persisted, it is what makes cloned authenticators detectable
        const dataUserLoginData: PasskeyLoginData = {
            ...storedData,
            counter: verification.authenticationInfo.newCounter,
            deviceType: verification.authenticationInfo.credentialDeviceType,
            backedUp: verification.authenticationInfo.credentialBackedUp,
        };
        loginData.data = dataUserLoginData;
        await this.loginDataService.save(loginData);

        return {
            result: { loginData, dataActiveLogin: {}, dataUserLoginData, mayRegister: false },
            returnedState: {},
            info: {},
        };
    }

    /**
     * Reads the credential the browser produced from the request.
     * Form submits send it as a JSON string, API clients may send it as an object.
     */
    private parseCredential(instance: StrategyInstance, req: Request): any {
        const credential = req.body?.credential;
        if (!credential) {
            throw new AuthException("No passkey was submitted", instance.id);
        }
        if (typeof credential === "object") {
            return credential;
        }
        if (typeof credential !== "string") {
            throw new AuthException("The submitted passkey is malformed", instance.id);
        }
        try {
            return JSON.parse(credential);
        } catch (err: any) {
            throw new AuthException("The submitted passkey is malformed", instance.id);
        }
    }

    /**
     * Returns all passkeys a user has registered on one strategy instance
     */
    private async findLoginDataOfUser(instance: StrategyInstance, user: LoginUser): Promise<UserLoginData[]> {
        return this.loginDataService.find({
            where: {
                user: { id: user.id },
                strategyInstance: { id: instance.id },
            },
        });
    }

    /**
     * Resolves the relying party of an instance from its config,
     * falling back to the deployment configuration and finally to `GROPIUS_ENDPOINT`.
     */
    private getRelyingParty(instance: StrategyInstance): RelyingParty {
        const endpoint = new URL(process.env.GROPIUS_ENDPOINT);
        const origins = this.splitOrigins(
            instance.instanceConfig["origin"] || process.env.GROPIUS_PASSKEY_ORIGIN || endpoint.origin,
        );
        return {
            id: instance.instanceConfig["rpId"] || process.env.GROPIUS_PASSKEY_RP_ID || endpoint.hostname,
            name: instance.instanceConfig["rpName"] || process.env.GROPIUS_PASSKEY_RP_NAME,
            origins,
            userVerification:
                instance.instanceConfig["userVerification"] || process.env.GROPIUS_PASSKEY_USER_VERIFICATION,
        };
    }

    private splitOrigins(origin?: string): string[] {
        return (origin ?? "")
            .split(",")
            .map((single) => single.trim())
            .filter((single) => single.length > 0);
    }

    private getTimeout(): number {
        return parseInt(process.env.GROPIUS_PASSKEY_TIMEOUT_MS, 10);
    }
}

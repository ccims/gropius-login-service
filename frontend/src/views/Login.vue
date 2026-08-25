<template>
    <BaseLayout>
        <template #content>
            <GropiusCard
                :go-back="isRegisterAdditional ? () => router.push('account') : undefined"
                class="login-container"
            >
                <template v-if="!loadingStrategies">
                    <p class="text-center text-body-1 mt-2">{{ title }}</p>
                    <v-sheet v-if="errorMessage" color="error-container" rounded="lger" class="pa-3 mt-2">
                        <v-icon icon="mdi-alert-circle-outline" size="x-large" />
                        {{ errorMessage }}
                    </v-sheet>
                    <template v-if="currentStrategies.credential.length > 0">
                        <v-tabs v-model="credentialTab" align-tabs="center">
                            <v-tab
                                v-for="(strategy, index) in currentStrategies.credential"
                                :key="index"
                                :value="index"
                            >
                                {{ strategy.name }}
                            </v-tab>
                        </v-tabs>
                        <v-divider />
                        <v-window v-model="credentialTab">
                            <v-window-item
                                v-for="(strategy, index) in currentStrategies.credential"
                                :key="index"
                                :value="index"
                                class="pt-4"
                            >
                                <v-form
                                    :ref="(el: any) => forms.set(index, el)"
                                    :action="`/auth/api/internal/auth/submit/${strategy.id}/${mode}`"
                                    method="POST"
                                    @submit.prevent="submitForm"
                                >
                                    <InputField
                                        v-for="(field, idx) in isLogin ? strategy.loginFields : strategy.registerFields"
                                        :key="idx"
                                        v-model="formDataAt(strategy.id)[field.name]"
                                        :field="field"
                                    />
                                    <input type="submit" hidden />
                                    <input type="hidden" name="csrf" :value="csrf" hidden />
                                    <input type="hidden" name="flow" :value="flow" hidden />
                                </v-form>
                            </v-window-item>
                        </v-window>
                        <DefaultButton class="w-100" @click="submitForm"> Continue</DefaultButton>
                    </template>
                    <div v-if="!isRegisterAdditional" class="mt-2">
                        <p v-if="isLogin">
                            <span class="text-middle">Don't have an account?</span>
                            <v-btn variant="text" density="comfortable" class="px-0" @click="toggleIsLogin"
                                >Sign up</v-btn
                            >
                        </p>
                        <p v-else>
                            <span class="text-middle">Already have an account?</span>
                            <v-btn variant="text" density="comfortable" class="px-0" @click="toggleIsLogin"
                                >Login</v-btn
                            >
                        </p>
                    </div>
                    <template v-if="currentStrategies.passkey.length > 0">
                        <v-divider class="mt-4 mb-3" />
                        <v-text-field
                            v-if="!isLogin"
                            v-model="passkeyUsername"
                            class="passkey-username"
                            name="username"
                            autocomplete="username"
                            label="Username"
                            hint="The name your passkey is saved under"
                        />
                        <DefaultButton
                            v-for="strategy in currentStrategies.passkey"
                            :key="strategy.id"
                            class="w-100 mt-2"
                            variant="outlined"
                            density="default"
                            :loading="passkeyPending"
                            @click="passkey(strategy)"
                        >
                            <v-icon icon="mdi-key-variant" start />
                            {{ `${passkeyVerb} ${strategy.name}` }}
                        </DefaultButton>
                    </template>
                    <template v-if="currentStrategies.redirect.length > 0">
                        <v-divider class="mt-4 mb-3" />
                        <DefaultButton
                            v-for="strategy in currentStrategies.redirect"
                            :key="strategy.id"
                            class="w-100 mt-2"
                            variant="outlined"
                            density="default"
                            @click="redirect(strategy)"
                        >
                            {{ `${isLogin ? "Login" : "Sign up"} with ${strategy.name}` }}
                        </DefaultButton>
                    </template>
                </template>
            </GropiusCard>
            <v-dialog v-model="showSyncDialog" width="auto">
                <v-card color="surface-elevated-3" rounded="lger" class="pa-3" elevation="0">
                    <v-card-title>Allow sync?</v-card-title>
                    <v-card-text>
                        Should we sync issues with this account?<br />You can always agree to this later.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <DefaultButton variant="text" @click="afterSelectSync!(false)">Do not sync</DefaultButton>
                        <DefaultButton variant="text" @click="afterSelectSync!(true)">Sync</DefaultButton>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-form ref="redirectForm" :action="redirectAction" method="POST" style="display: none">
                <input type="hidden" name="csrf" :value="csrf" hidden />
                <input type="hidden" name="flow" :value="flow" hidden />
            </v-form>

            <v-form ref="passkeyForm" :action="passkeyAction" method="POST" style="display: none">
                <input type="hidden" name="credential" :value="passkeyCredential" hidden />
                <input type="hidden" name="csrf" :value="csrf" hidden />
                <input type="hidden" name="flow" :value="flow" hidden />
            </v-form>
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import { ref, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
    CredentialStrategyInstance,
    GroupedStrategyInstances,
    PasskeyStrategyInstance,
    RedirectStrategyInstance,
    LoginStrategy,
    LoginStrategyInstance
} from "./model";
import { browserSupportsWebAuthn, startAuthentication, startRegistration } from "@simplewebauthn/browser";
import GropiusCard from "@/components/GropiusCard.vue";
import { withErrorMessage } from "@/util/withErrorMessage";
import { asyncComputed } from "@vueuse/core";
import axios from "axios";
import InputField from "@/components/InputField.vue";
import * as auth from "@/util/auth";

const router = useRouter();
const route = useRoute();

const csrf = asyncComputed(auth.loadCSRFToken);
const flow = asyncComputed(auth.loadFlowToken);

const forms = ref(new Map<number, any>());

const isLogin = ref(true);
const isRegisterAdditional = computed(() => route.name == "register-additional");
const mode = ref<"login" | "register" | "register-sync">("login");

const title = computed(() => {
    if (isRegisterAdditional.value) {
        return "Register additional account";
    } else if (isLogin.value) {
        return "Login to continue";
    } else {
        return "Sign up to continue";
    }
});

const localErrorMessage = ref<string>();

// a passkey button either logs in with an existing passkey, creates one for a new account
// or adds one to the account the user is already logged in with
const passkeyVerb = computed(() => {
    if (isRegisterAdditional.value) {
        return "Add";
    }
    return isLogin.value ? "Login with" : "Sign up with";
});

const errorMessage = computed(() => {
    if (localErrorMessage.value) {
        return localErrorMessage.value;
    }
    if (route.query.error) {
        return route.query.error as string;
    }
    return undefined;
});

const loadingStrategies = ref(true);
const strategies = asyncComputed(
    async () => {
        const strategies: LoginStrategy[] = await withErrorMessage(
            async () => (await axios.get(`/auth/api/login/strategy/`, {})).data,
            "Could not fetch available strategies"
        );
        const instances: LoginStrategyInstance[] = await withErrorMessage(
            async () => (await axios.get(`/auth/api/login/strategy-instance/`, {})).data,
            "Could not fetch available strategy instances"
        );
        const strategiesByName = new Map(strategies.map((s) => [s.typeName, s]));
        // passkeys can only be used if the browser knows about WebAuthn at all
        const passkeyInstances = browserSupportsWebAuthn()
            ? instances
                  .filter((instance) => strategiesByName.get(instance.type)?.needsPasskeyFlow)
                  .map(
                      (instance) =>
                          ({
                              ...instance,
                              type: "passkey"
                          }) satisfies PasskeyStrategyInstance
                  )
            : [];

        const redirectInstances = instances
            .filter((instance) => strategiesByName.get(instance.type)?.needsRedirectFlow)
            .map(
                (instance) =>
                    ({
                        ...instance,
                        type: "redirect"
                    }) satisfies RedirectStrategyInstance
            );

        const credentialInstances = instances
            .filter((instance) => !strategiesByName.get(instance.type)?.needsPasskeyFlow)
            .filter((instance) => Object.keys(strategiesByName.get(instance.type)?.acceptsVariables ?? {}).length > 0)
            .map((instance) => {
                const strategy = strategiesByName.get(instance.type);
                const fields = strategy?.acceptsVariables ?? [];
                return {
                    ...instance,
                    type: "credential",
                    loginFields: fields,
                    registerFields: fields
                } satisfies CredentialStrategyInstance;
            });
        const errorStrategyInstance = route.query["strategy_instance"];
        if (typeof errorStrategyInstance === "string") {
            const index = credentialInstances.findIndex((instance) => instance.id === errorStrategyInstance);
            if (index !== -1) {
                credentialTab.value = index;
            }
        }
        return [...redirectInstances, ...passkeyInstances, ...credentialInstances];
    },
    [],
    { shallow: false, evaluating: loadingStrategies }
);

const currentStrategies = computed<GroupedStrategyInstances>(() => {
    const loginInstances = strategies.value.filter((strategy) => {
        if (isRegisterAdditional.value) {
            return true;
        }
        if (!strategy.isLoginActive) {
            return false;
        }
        return isLogin.value || strategy.isSelfRegisterActive;
    });
    return {
        credential: loginInstances.filter((strategy) => strategy.type === "credential") as CredentialStrategyInstance[],
        redirect: loginInstances.filter((strategy) => strategy.type === "redirect") as RedirectStrategyInstance[],
        passkey: loginInstances.filter((strategy) => strategy.type === "passkey") as PasskeyStrategyInstance[]
    };
});
const credentialTab = ref(0);
const showSyncDialog = ref(false);
const afterSelectSync = ref<undefined | ((sync: boolean) => void)>();
const formData = ref<Record<string, Record<string, string>>>({});

function formDataAt(id: string) {
    if (!(id in formData.value)) {
        formData.value[id] = {};
    }
    return formData.value[id];
}

function toggleIsLogin() {
    isLogin.value = !isLogin.value;
    credentialTab.value = 0;
    formData.value = {};
    passkeyUsername.value = "";
    localErrorMessage.value = undefined;
}

function submitForm() {
    const strategy = currentStrategies.value.credential[credentialTab.value];
    if (isLogin.value && !isRegisterAdditional.value) {
        submitFormWithMode("login");
    } else {
        if (strategy.isSyncActive) {
            afterSelectSync.value = (sync) => {
                showSyncDialog.value = false;
                submitFormWithMode(sync ? "register-sync" : "register");
            };
            showSyncDialog.value = true;
        } else {
            submitFormWithMode("register");
        }
    }
}

function submitFormWithMode(formMode: "login" | "register" | "register-sync") {
    mode.value = formMode;
    nextTick(() => forms.value.get(credentialTab.value).submit());
}

const passkeyForm = ref<HTMLFormElement | null>(null);
const passkeyAction = ref<string>("");
const passkeyCredential = ref<string>("");
const passkeyUsername = ref("");
const passkeyPending = ref(false);

/**
 * Runs a passkey ceremony and submits its result to the regular submit endpoint.
 *
 * The passkey itself never leaves the authenticator, what is submitted is only the
 * signed answer to the challenge the login service handed out.
 */
async function passkey(strategy: PasskeyStrategyInstance) {
    if (passkeyPending.value) {
        return;
    }
    passkeyPending.value = true;
    localErrorMessage.value = undefined;

    try {
        const isPasskeyLogin = isLogin.value && !isRegisterAdditional.value;
        const credential = isPasskeyLogin
            ? await startAuthentication({
                  optionsJSON: await requestPasskeyOptions(strategy, "authentication-options")
              })
            : await startRegistration({
                  optionsJSON: await requestPasskeyOptions(strategy, "registration-options", passkeyUsername.value)
              });

        passkeyCredential.value = JSON.stringify(credential);
        passkeyAction.value = `/auth/api/internal/auth/submit/${strategy.id}/${isPasskeyLogin ? "login" : "register"}`;
        await nextTick();
        // the page navigates away with the response, so the pending state is never reset here
        passkeyForm.value?.submit();
    } catch (error: any) {
        passkeyPending.value = false;
        localErrorMessage.value = passkeyErrorMessage(error);
    }
}

async function requestPasskeyOptions(
    strategy: PasskeyStrategyInstance,
    endpoint: "authentication-options" | "registration-options",
    username?: string
) {
    const { data } = await axios.post(`/auth/api/internal/auth/passkey/${strategy.id}/${endpoint}`, {
        csrf: csrf.value,
        flow: flow.value,
        ...(username?.trim() ? { username: username.trim() } : {})
    });
    return data;
}

function passkeyErrorMessage(error: any): string {
    if (error?.code == "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED") {
        return "This device already has a passkey for this account.";
    }
    if (error?.name == "NotAllowedError" || error?.cause?.name == "NotAllowedError") {
        return "The passkey request was cancelled or timed out.";
    }
    return error?.response?.data?.message ?? error?.message ?? "Could not use a passkey";
}

const redirectForm = ref<HTMLFormElement | null>(null);
const redirectAction = ref<string>("");

async function submitRedirectPost(action: string) {
    redirectAction.value = action;
    await nextTick();
    redirectForm.value?.submit();
}

function redirect(strategy: RedirectStrategyInstance) {
    if (isLogin.value && !isRegisterAdditional.value) {
        redirectLogin(strategy);
    } else {
        if (strategy.isSyncActive) {
            afterSelectSync.value = (sync) => {
                showSyncDialog.value = false;
                redirectRegister(strategy, sync);
            };
            showSyncDialog.value = true;
        } else {
            redirectRegister(strategy, false);
        }
    }
}

async function redirectLogin(strategyInstance: RedirectStrategyInstance) {
    await submitRedirectPost(`/auth/api/internal/auth/redirect/${strategyInstance.id}/login`);
}

async function redirectRegister(strategyInstance: RedirectStrategyInstance, sync: boolean) {
    const mode = sync ? "register-sync" : "register";
    await submitRedirectPost(`/auth/api/internal/auth/redirect/${strategyInstance.id}/${mode}`);
}
</script>
<style scoped>
.login-container {
    max-width: 500px;
    margin-inline: auto;
}

.text-middle {
    vertical-align: middle;
}
</style>

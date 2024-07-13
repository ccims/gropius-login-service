<template>
    <BaseLayout>
        <template #content>
            <GropiusCard class="login-container mt-5" v-if="!loadingStrategies">
                <p class="text-center text-body-1 mt-2">{{ isLogin ? "Login to continue" : "Sign up to continue" }}</p>
                <v-sheet color="error-container" v-if="errorMessage" rounded="lger" class="pa-3 mt-2">
                    <v-icon icon="mdi-alert-circle-outline" size="x-large"/>
                    {{ errorMessage }}
                </v-sheet>
                <v-tabs v-model="credentialTab" align-tabs="center">
                    <v-tab v-for="(strategy, index) in currentStrategies.credential" :key="index" :value="index">
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
                            @submit.prevent="submitForm"
                        >
                            <v-text-field
                                v-for="(field, idx) in isLogin ? strategy.loginFields : strategy.registerFields"
                                :key="idx"
                                :label="field.displayName ?? field.name"
                                :name="field.name"
                                v-model="formDataAt(strategy.id)[field.name]"
                                :type="
                                    isPwdVisibleAt(strategy.id)[field.name] || field.type != 'password'
                                        ? 'text'
                                        : 'password'
                                "
                                :append-inner-icon="
                                    field.type == 'password'
                                        ? isPwdVisibleAt(strategy.id)[field.name]
                                            ? 'mdi-eye'
                                            : 'mdi-eye-off'
                                        : undefined
                                "
                                @click:appendInner="
                                    isPwdVisibleAt(strategy.id)[field.name] = !isPwdVisibleAt(strategy.id)[field.name]
                                "
                            ></v-text-field>
                            <input type="hidden" name="state" :value="route.query.state"/>
                            <input type="submit" hidden />
                        </v-form>
                    </v-window-item>
                </v-window>
                <DefaultButton class="w-100" @click="submitForm"> Continue </DefaultButton>
                <div v-if="allowModeSwitch" class="mt-2">
                    <p v-if="isLogin">
                        <span class="text-middle">Don't have an account?</span>
                        <v-btn variant="text" density="comfortable" class="px-0" @click="toggleIsLogin">Sign up</v-btn>
                    </p>
                    <p v-else>
                        <span class="text-middle">Already have an account?</span>
                        <v-btn variant="text" density="comfortable" class="px-0" @click="toggleIsLogin">Login</v-btn>
                    </p>
                </div>
                <template v-if="currentStrategies.redirect.length > 0">
                    <v-divider class="mt-4 mb-3" />
                    <DefaultButton
                        v-for="strategy in currentStrategies.redirect"
                        :key="strategy.id"
                        class="w-100 my-2"
                        variant="outlined"
                        density="default"
                        @click="redirect(strategy)"
                    >
                        {{ `${isLogin ? "Login" : "Sign up"} with ${strategy.name}` }}
                    </DefaultButton>
                </template>
            </GropiusCard>
            <v-dialog v-model="showSyncDialog" width="auto">
                <v-card color="surface-elevated-3" rounded="lger" class="pa-3" elevation="0">
                    <v-card-title>Allow sync?</v-card-title>
                    <v-card-text>
                        Shoule we sync issues with this account?<br />You can always agree to this later.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <DefaultButton variant="text" @click="afterSelectSync!(false)">Do not sync</DefaultButton>
                        <DefaultButton variant="text" @click="afterSelectSync!(true)">Sync</DefaultButton>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import { ref, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import {
    CredentialStrategyInstance,
    GroupedStrategyInstances,
    RedirectStrategyInstance,
    LoginStrategy,
    LoginStrategyInstance,
    OAuthRespose
} from "./model";
import GropiusCard from "@/components/GropiusCard.vue";
import { withErrorMessage } from "@/util/withErrorMessage";
import { asyncComputed } from "@vueuse/core";
import axios from "axios";

const route = useRoute();

const forms = ref(new Map<number, any>());

const isLogin = ref(true);
const mode = ref<"login" | "register" | "register-sync">("login");
const allowModeSwitch = ref(true);

const errorMessage = computed(() => {
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
            async () => (await axios.get(`/auth/api/login/strategyInstance/`, {})).data,
            "Could not fetch available strategy instances"
        );
        const strategiesByName = new Map(strategies.map((s) => [s.typeName, s]));
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
            .filter((instance) => Object.keys(strategiesByName.get(instance.type)?.acceptsVariables ?? {}).length > 0)
            .map((instance) => {
                const strategy = strategiesByName.get(instance.type);
                const fields = Object.values(strategy?.acceptsVariables ?? {});
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
        return [...redirectInstances, ...credentialInstances];
    },
    [],
    { shallow: false, evaluating: loadingStrategies }
);

const currentStrategies = computed<GroupedStrategyInstances>(() => {
    const loginInstances = strategies.value.filter(
        (strategy) => (strategy.isLoginActive && isLogin.value) || (strategy.isSelfRegisterActive && !isLogin.value)
    );
    return {
        credential: loginInstances.filter((strategy) => strategy.type === "credential") as CredentialStrategyInstance[],
        redirect: loginInstances.filter((strategy) => strategy.type === "redirect") as RedirectStrategyInstance[]
    };
});
const credentialTab = ref(0);
const showSyncDialog = ref(false);
const afterSelectSync = ref<undefined | ((sync: boolean) => void)>();
const formData = ref<Record<string, Record<string, string>>>({});
const isPwdVisible = ref<Record<string, Record<string, boolean>>>({});

function formDataAt(id: string) {
    if (!(id in formData.value)) {
        formData.value[id] = {};
    }
    return formData.value[id];
}

function isPwdVisibleAt(id: string) {
    if (!(id in isPwdVisible.value)) {
        isPwdVisible.value[id] = {};
    }
    return isPwdVisible.value[id];
}

function toggleIsLogin() {
    isLogin.value = !isLogin.value;
    credentialTab.value = 0;
    formData.value = {};
    isPwdVisible.value = {};
}

function submitForm() {
    const strategy = currentStrategies.value.credential[credentialTab.value];
    if (isLogin.value) {
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

function redirect(strategy: RedirectStrategyInstance) {
    if (isLogin.value) {
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
    // TODO: add oauth state
    window.location.href = `/api/login/authenticate/oauth/${strategyInstance.id}/authorize/login?client_id=${"TODO"}`;
}

async function redirectRegister(strategyInstance: RedirectStrategyInstance, sync: boolean) {
    // TODO: add oauth state
    const mode = sync ? "register-sync" : "register";
    window.location.href = `/api/login/authenticate/oauth/${strategyInstance.id}/authorize/${mode}?client_id=${"TODO"}`;
}
</script>
<style scoped>
.login-container {
    max-width: 500px;
    margin: 0 auto;
}

.text-middle {
    vertical-align: middle;
}
</style>

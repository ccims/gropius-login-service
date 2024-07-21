<template>
    <BaseLayout>
        <template #content>
            <GropiusCard class="update-container mt-5 pb-4" v-if="strategy != undefined">
                <v-window v-model="actionTab">
                    <v-window-item :value="0">
                        <v-sheet color="success" v-if="showSuccessMessage" rounded="lger" class="pa-3 my-2">
                            <v-icon icon="mdi-check" size="x-large" />
                            Success
                        </v-sheet>
                        <p class="text-center text-h6 my-2">Choose an action</p>
                        <div class="d-flex flex-column ga-2">
                            <DefaultButton
                                v-for="(updateAction, idx) in strategy.updateActions"
                                :key="idx"
                                @click="chooseAction(updateAction)"
                                class="w-100"
                            >
                                {{ updateAction.displayName }}
                            </DefaultButton>
                        </div>
                    </v-window-item>
                    <v-window-item :value="1">
                        <div class="d-flex align-center">
                            <IconButton @click="goBack">
                                <v-icon icon="mdi-arrow-left" />
                                <v-tooltip bottom>Back</v-tooltip>
                            </IconButton>
                            <span class="text-h6 my-2">{{ chosenAction?.displayName }}</span>
                        </div>
                        <v-form @submit.prevent="submitForm">
                            <div class="d-flex flex-column ga-2 mt-2">
                                <InputField
                                    v-for="(field, idx) in chosenAction?.variables"
                                    :key="idx"
                                    :field="field"
                                    v-model="formData[field.name]"
                                />
                            </div>
                            <DefaultButton type="submit" class="w-100"> Submit </DefaultButton>
                        </v-form>
                    </v-window-item>
                </v-window>
            </GropiusCard>
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import GropiusCard from "@/components/GropiusCard.vue";
import axios from "axios";
import { computed } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LoginStrategy, LoginStrategyInstance, LoginStrategyUpdateAction } from "./model";
import { onMounted } from "vue";
import InputField from "@/components/InputField.vue";

const route = useRoute();
const router = useRouter();

const actionTab = ref(0);
const showSuccessMessage = ref(false);

const id = computed(() => (route.query.id as string | undefined) ?? JSON.parse(route.query.state as string).id);

const accessToken = ref<string>();

const strategy = ref<LoginStrategy>();

const chosenAction = ref<LoginStrategyUpdateAction>();

const formData = ref<Record<string, string>>({});

function chooseAction(action: LoginStrategyUpdateAction) {
    chosenAction.value = action;
    actionTab.value = 1;
    formData.value = {};
}

function goBack() {
    actionTab.value = 0;
    showSuccessMessage.value = false;
}

async function submitForm() {
    await axios.put(`/auth/api/internal/update-action/${id.value}/${chosenAction.value?.name}`, formData.value, {
        headers: {
            Authorization: `Bearer ${accessToken.value}`
        }
    });
    actionTab.value = 0;
    showSuccessMessage.value = true;
}

onMounted(async () => {
    const code = route.query.code!.toString();
    const codeVerifier = localStorage.getItem("loginServiceCodeVerifier");
    router.replace({ query: { id: id.value } });
    accessToken.value = (
        await axios.post("/auth/oauth/token", {
            grant_type: "authorization_code",
            client_id: "login-auth-client",
            code,
            code_verifier: codeVerifier
        })
    ).data.access_token as string;

    const strategyInstance = (
        await axios.get(`/auth/api/login/login-data/${id.value}`, {
            headers: {
                Authorization: `Bearer ${accessToken.value}`
            }
        })
    ).data.strategyInstance as LoginStrategyInstance;
    strategy.value = (await axios.get(`/auth/api/login/strategy/${strategyInstance.type}`)).data as LoginStrategy;
});
</script>
<style scoped>
.update-container {
    max-width: 500px;
    margin: 0 auto;
}
</style>

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
                        <v-sheet
                            color="error-container"
                            v-if="errorMessage != undefined"
                            rounded="lger"
                            class="pa-3 my-2"
                        >
                            <v-icon icon="mdi-alert-circle-outline" size="x-large" />
                            {{ errorMessage }}
                        </v-sheet>
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
import * as oauth from '../util/oauth'

const route = useRoute();
const router = useRouter();

const actionTab = ref(0);
const showSuccessMessage = ref(false);
const errorMessage = ref<string>();

const id = computed(() => (route.query.id as string | undefined) ?? JSON.parse(route.query.state as string).id);

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
    errorMessage.value = undefined;
}

async function submitForm() {
    try {
        await axios.put(`/auth/api/internal/update-action/${id.value}/${chosenAction.value?.name}`, formData.value, {
            headers: {
                Authorization: `Bearer ${oauth.getAccessToken()}`
            }
        });
        actionTab.value = 0;
        showSuccessMessage.value = true;
        errorMessage.value = undefined;
    } catch (e: any) {
        errorMessage.value = e.response?.data?.message ?? "An error occurred";
    }
}

onMounted(async () => {
    const code = route.query.code!.toString();
    router.replace({ query: { id: id.value } });
    const {accessToken} = await oauth.exchangeToken(code)

    const strategyInstance = (
        await axios.get(`/auth/api/login/login-data/${id.value}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
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

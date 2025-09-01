<template>
    <BaseLayout>
        <template #content>
            <GropiusCard v-if="strategy != undefined" class="update-container mt-5 pb-4">
                <v-window v-model="actionTab">
                    <v-window-item :value="0">
                        <v-sheet v-if="showSuccessMessage" color="success" rounded="lger" class="pa-3 my-2">
                            <v-icon icon="mdi-check" size="x-large" />
                            Success
                        </v-sheet>
                        <p class="text-center text-h6 my-2">{{ strategy.typeName }}</p>
                        <div class="d-flex flex-column ga-2">
                            <DefaultButton
                                v-for="(updateAction, idx) in strategy.updateActions"
                                :key="idx"
                                class="w-100"
                                @click="chooseAction(updateAction)"
                            >
                                {{ updateAction.displayName }}
                            </DefaultButton>

                            <p v-if="!strategy.updateActions.length" class="text-center my-2">No actions ...</p>
                        </div>
                    </v-window-item>
                    <v-window-item :value="1">
                        <v-sheet
                            v-if="errorMessage != undefined"
                            color="error-container"
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
                        <v-form @submit.prevent="onUpdate">
                            <div class="d-flex flex-column ga-2 mt-2">
                                <InputField
                                    v-for="(field, idx) in chosenAction?.variables"
                                    :key="idx"
                                    v-model="formData[field.name]"
                                    :field="field"
                                />
                            </div>
                            <DefaultButton type="submit" class="w-100"> Submit</DefaultButton>
                        </v-form>
                    </v-window-item>
                </v-window>

                <DefaultButton class="w-100 mt-4" @click="onDelete">Delete</DefaultButton>

                <DefaultButton class="w-100 mt-4" variant="outlined" @click="router.push('account')">
                    Back
                </DefaultButton>
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
import * as auth from "../util/auth";

const route = useRoute();
const router = useRouter();

const actionTab = ref(0);
const showSuccessMessage = ref(false);
const errorMessage = ref<string>();

const id = computed(() => route.query.id as string | undefined);

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

async function onUpdate() {
    try {
        await axios.put(
            `/auth/api/internal/update-action/${id.value}/${chosenAction.value?.name}`,
            formData.value,
            await auth.loadAuthorizationHeader()
        );
        actionTab.value = 0;
        showSuccessMessage.value = true;
        errorMessage.value = undefined;
    } catch (e: any) {
        errorMessage.value = e.response?.data?.message ?? "An error occurred";
    }
}

async function onDelete() {
    if (!window.confirm("Delete this login data?")) return;
    await axios.post(`/auth/api/internal/update-action/${id.value}/delete`, {}, await auth.loadAuthorizationHeader());
    await router.push("account");
}

onMounted(async () => {
    const strategyInstance = (
        await axios.get(`/auth/api/login/login-data/${id.value}`, await auth.loadAuthorizationHeader())
    ).data.strategyInstance as LoginStrategyInstance;

    strategy.value = (
        await axios.get(`/auth/api/login/strategy/${strategyInstance.type}`, await auth.loadAuthorizationHeader())
    ).data as LoginStrategy;
});
</script>
<style scoped>
.update-container {
    max-width: 500px;
    margin: 0 auto;
}
</style>

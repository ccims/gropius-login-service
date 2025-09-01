<template>
    <BaseLayout>
        <template #content>
            <GropiusCard class="prompt-container mt-5 mb-4">
                <v-card-title class="text-center mb-4">Permission Prompt</v-card-title>

                <v-card-text v-if="data">
                    <code>{{ data.clientName }}</code> wants to access your account <code>{{ data.username }}</code
                    >. This includes also your linked accounts.

                    <template v-if="data.scope.length">
                        <br />
                        <br />

                        The following scopes are requested.

                        <br />
                        <br />

                        <ul class="ml-4">
                            <li v-for="scope in data.scope" :key="scope">
                                <code>{{ scope }}</code>
                            </li>
                        </ul>
                    </template>

                    <br />

                    If you grant access, you will be redirected to

                    <br />
                    <br />

                    <code>{{ data.redirect }}</code>

                    <br />
                    <br />

                    <v-form
                        ref="form"
                        action="/auth/api/internal/auth/prompt/callback"
                        method="POST"
                        style="display: none"
                    >
                        <input type="text" name="consent" :value="consent" hidden />
                        <input type="text" name="flow" :value="data.flow" hidden />
                    </v-form>

                    <DefaultButton class="w-100 mb-4" @click="onGrant">Grant Access</DefaultButton>
                    <DefaultButton class="w-100" variant="outlined" @click="onSubmit">Reject Access</DefaultButton>
                </v-card-text>
                <v-card-text v-else> Loading ...</v-card-text>
            </GropiusCard>
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import GropiusCard from "@/components/GropiusCard.vue";
import * as auth from "../util/auth";
import { nextTick, onMounted, ref } from "vue";

const form = ref<HTMLFormElement>();

const consent = ref<boolean>(false);

function onGrant() {
    consent.value = true;
    onSubmit();
}

function onSubmit() {
    if (form.value) nextTick(() => form.value!.submit());
}

const data = ref<auth.PromptData | null>(null);
onMounted(async () => {
    data.value = await auth.fetchPromptData();
});
</script>
<style scoped>
.prompt-container {
    max-width: 500px;
    margin: 0 auto;
}
</style>

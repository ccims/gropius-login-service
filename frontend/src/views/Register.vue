<template>
    <BaseLayout>
        <template #content>
            <GropiusCard class="register-container mt-5">
                <v-card-title class="pl-0">Complete registration</v-card-title>
                <v-form class="mt-2" method="POST" action="/auth/api/internal/auth/register">
                    <v-text-field
                        v-model="username"
                        v-if="!forceSuggestedUsername"
                        name="username"
                        v-bind="usernameProps"
                        label="Username"
                        class="mb-1"
                    />
                    <input v-else type="hidden" name="username" :value="username" />
                    <v-text-field
                        v-model="displayName"
                        name="displayName"
                        v-bind="displayNameProps"
                        label="Display name"
                        class="mb-1"
                    />
                    <v-text-field v-model="email" name="email" v-bind="emailProps" label="Email" class="mb-1" />
                    <input type="hidden" name="register_token" :value="token" />
                    <v-card-actions>
                        <v-spacer />
                        <DefaultButton variant="text" color="primary" type="submit">Register</DefaultButton>
                    </v-card-actions>
                </v-form>
            </GropiusCard>
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import GropiusCard from "@/components/GropiusCard.vue";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useRoute } from "vue-router";
import axios from "axios";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import { computed, onMounted } from "vue";
import { asyncComputed } from "@vueuse/core";

const route = useRoute();
const forceSuggestedUsername = computed(() => route.query.forceSuggestedUsername == "true");

const schema = toTypedSchema(
    yup.object().shape({
        username: yup.string().required().label("Username"),
        displayName: yup.string().notRequired().label("Display name"),
        email: yup.string().email().notRequired().label("Email")
    })
);

const token = asyncComputed(async () => {
    return (
        await axios.post("/auth/oauth/token", {
            grant_type: "authorization_code",
            client_id: "login-auth-client",
            code: route.query.code,
            scope: "login-register"
        })
    ).data.access_token as string;
}, "");

const { defineField, handleSubmit, setValues } = useForm({
    validationSchema: schema
});

const [username, usernameProps] = defineField("username", fieldConfig);
const [displayName, displayNameProps] = defineField("displayName", fieldConfig);
const [email, emailProps] = defineField("email", fieldConfig);

onMounted(async () => {
    const params = route.query as Record<string, string>;
    setValues({
        username: params.username ?? "",
        displayName: (params.displayName || params.username) ?? "",
        email: params.email ?? ""
    });
});
</script>
<style scoped>
.register-container {
    max-width: 500px;
    margin: 0 auto;
}
</style>

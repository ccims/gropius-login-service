<template>
    <BaseLayout>
        <template #content>
            <GropiusCard class="register-container mt-5">
                <v-card-title class="pl-0">Register</v-card-title>
                <v-form class="mt-2" @submit.prevent="register">
                    <v-text-field v-model="username" v-bind="usernameProps" label="Username" class="mb-1" />
                    <v-text-field v-model="displayName" v-bind="displayNameProps" label="Display name" class="mb-1" />
                    <v-text-field v-model="email" v-bind="emailProps" label="Email" class="mb-1" />
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
import { TokenScope, UserDataSuggestionResponse, UserDataSuggestionStatus } from "./model";
import { useRouter } from "vue-router";
import { withErrorMessage } from "@/util/withErrorMessage";
import axios from "axios";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import { onMounted } from "vue";
const router = useRouter();

const schema = toTypedSchema(
    yup.object().shape({
        username: yup.string().required().label("Username"),
        displayName: yup.string().notRequired().label("Display name"),
        email: yup.string().email().notRequired().label("Email")
    })
);

const { defineField, handleSubmit, setValues } = useForm({
    validationSchema: schema
});

const [username, usernameProps] = defineField("username", fieldConfig);
const [displayName, displayNameProps] = defineField("displayName", fieldConfig);
const [email, emailProps] = defineField("email", fieldConfig);

onMounted(async () => {
    const recommendedData: UserDataSuggestionResponse = await withErrorMessage(
        async () =>
            (
                await axios.post("/api/login/login/registration/data-suggestion", {
                    register_token: "TODO"
                })
            ).data,
        "Could not prefill registration fields"
    );

    switch (recommendedData.status) {
        case UserDataSuggestionStatus.ALREADY_REGISTERED:
            router.replace({ name: "login" });
            //pushErrorMessage("User already registered");
            break;
        case UserDataSuggestionStatus.USERNAME_TAKEN:
            //pushErrorMessage("Username already taken. Choose another");
            break;
    }
    setValues({
        username: recommendedData.username ?? "",
        displayName: recommendedData.displayName ?? recommendedData.username ?? "",
        email: recommendedData.email ?? ""
    });
});

const register = handleSubmit(async (state) => {
    const registerRes = await withErrorMessage(
        async () =>
            await axios.post("/api/login/login/registration/self-register", {
                username: state.username,
                displayName: state.displayName ?? state.username,
                email: state.email || undefined,
                register_token: "TODO"
            }),
        "Could not register. Maybe try another username. Or re log in. I don't know because this is a generic error message. You might get details from the dev console. Or you might not. I don't know."
    );
    if (registerRes.data.result != "success") {
        //pushErrorMessage("Registration failed");
    }
    /*
    await withErrorMessage(() => store.forceTokenRefresh(), "Could not log in after registration");
    if ((await store.getValidTokenScopes()).includes(TokenScope.BACKEND)) {
        router.replace({ name: "home" });
    } else {
        //pushErrorMessage("Could not log in after registration");
    }
    */
});
</script>
<style scoped>
.register-container {
    max-width: 500px;
    margin: 0 auto;
}
</style>

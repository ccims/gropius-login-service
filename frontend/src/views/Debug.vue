<template>
    <BaseLayout>
        <template #content>
            <GropiusCard class="account-container mt-5 pb-4">
                <v-card-title class="text-center mb-4">Debug</v-card-title>

                <DefaultButton class="w-100" @click="testAccessToken">Test Access Token</DefaultButton>

                <DefaultButton class="w-100 mt-4" @click="testRefreshToken">Test Refresh Token</DefaultButton>
            </GropiusCard>
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import GropiusCard from "@/components/GropiusCard.vue";
import axios from "axios";
import * as auth from "../util/auth";

const testAccessToken = async () => {
    try {
        await axios.get("/auth/api/login/user/self", await auth.loadAuthorizationHeader());
        alert("Access token is valid.");
    } catch (e) {
        console.log(e);
        alert("Access token is invalid.");
    }
};

const testRefreshToken = async () => {
    try {
        await auth.refreshToken();
        alert("Refreshed token is valid");
    } catch (e) {
        console.log(e);
        alert("Refresh token is invalid.");
    }
};
</script>
<style scoped>
.account-container {
    max-width: 500px;
    margin: 0 auto;
}
</style>

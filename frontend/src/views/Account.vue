<template>
    <BaseLayout>
        <template #content>
            <GropiusCard class="account-container mt-5 pb-4">
                <v-card-title class="text-center mb-4">Account</v-card-title>

                <v-sheet
                    v-for="account in accounts"
                    :key="account.id"
                    rounded="lger"
                    color="surface-container-low"
                    class="py-2 my-3 d-flex align-center"
                >
                    <v-list-item
                        :title="account.strategyInstance.name"
                        :subtitle="account.description"
                        lines="one"
                        class="w-100 pr-1 pl-3"
                    >
                        <template #append>
                            <IconButton :to="{ name: 'update', query: { id: account.id } }">
                                <v-icon icon="mdi-cog" />
                                <v-tooltip activator="parent">Settings</v-tooltip>
                            </IconButton>
                        </template>
                    </v-list-item>
                </v-sheet>

                <DefaultButton class="w-100 mt-4" to="register-additional">Link Account</DefaultButton>

                <DefaultButton class="w-100 mt-4" @click="() => auth.logout('current')"> Logout Session</DefaultButton>

                <DefaultButton class="w-100 mt-4" variant="outlined" @click="() => auth.logout('everywhere')">
                    Logout Everywhere
                </DefaultButton>
            </GropiusCard>
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import GropiusCard from "@/components/GropiusCard.vue";
import axios from "axios";
import { StrategyInstance } from "./model";
import * as auth from "../util/auth";
import { asyncComputed } from "@vueuse/core";

const accounts = asyncComputed(async () => {
    return (
        await axios.get<{ id: string; strategyInstance: StrategyInstance; description: string }[]>(
            "/auth/api/login/user/self/login-data",
            await auth.loadAuthorizationHeader()
        )
    ).data;
});
</script>
<style scoped>
.account-container {
    max-width: 500px;
    margin: 0 auto;
}
</style>

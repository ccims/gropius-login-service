<template>
    <div class="root h-100 w-100 d-flex flex-column">
        <div class="header d-flex align-center my-2">
            <v-btn class="d-flex ml-5" variant="text" icon size="small" href="/">
                <img src="@/assets/logo.svg" width="40" />
            </v-btn>
            <v-btn variant="text" class="px-1" min-width="0" rounded="lger" href="/">
                <span class="text-h6">Gropius</span>
            </v-btn>
            <v-spacer />
            <div class="mr-5">
                <v-btn icon variant="tonal" size="small" @click="toggleDarkMode()">
                    <v-icon :icon="lightMode ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="large" />
                    <v-tooltip activator="parent" location="bottom"> Toggle light/dark mode </v-tooltip>
                </v-btn>
            </div>
        </div>
        <div class="h-0 d-flex flex-grow-1 mb-3">
            <div class="left-bar" />
            <v-sheet color="surface" class="h-100 w-0 overflow-hidden flex-grow-1" rounded="xl">
                <slot name="content"></slot>
            </v-sheet>
            <div class="right-bar" />
        </div>
        <div v-if="legalInformation?.length ?? 0 > 0" class="d-flex justify-end mr-3 mt-n2 mb-1 ga-3">
            <RouterLink
                v-for="info in legalInformation"
                :key="info.id"
                :to="{
                    name: 'legal-information',
                    params: { legalInformation: info.id }
                }"
                class="text-decoration-none text-medium-emphasis text-caption"
            >
                {{ info.label }}
            </RouterLink>
        </div>
    </div>
</template>
<script setup lang="ts">
import { withErrorMessage } from "@/util/withErrorMessage";
import { useLocalStorage } from "@vueuse/core";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useTheme } from "vuetify";

interface LegalInformation {
    id: string;
    label: string;
}

const theme = useTheme();
const lightMode = useLocalStorage("lightMode", true);

function toggleDarkMode() {
    lightMode.value = !lightMode.value;
    updateColorMode();
}

function updateColorMode() {
    theme.global.name.value = lightMode.value ? "light" : "dark";
}

updateColorMode();

const legalInformation = ref<LegalInformation[]>([]);

onMounted(async () => {
    legalInformation.value = await withErrorMessage(
        async () => (await axios.get(`/auth/api/internal/legal-information/`)).data.legalInformation,
        "Could not fetch available legal information"
    );
});
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";

.root {
    background: rgb(var(--v-theme-surface-container));
}

.left-bar,
.right-bar,
.side-bar-width {
    width: settings.$side-bar-width;
}

.left-bar,
.right-bar {
    height: 100%;
}

.text-ellipsis {
    max-width: 100%;
}
</style>

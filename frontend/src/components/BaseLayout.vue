<template>
    <div class="root h-100 w-100 d-flex flex-column">
        <div class="header d-flex align-center my-2">
            <div class="ml-5">
                <router-link to="/">
                    <v-btn class="d-flex" variant="text" icon size="small">
                        <img src="@/assets/logo.svg" width="40" />
                    </v-btn>
                </router-link>
            </div>
            <slot name="header-title">
                <div class="d-flex align-center">
                    <router-link to="/">
                        <v-btn variant="text" class="px-1" min-width="0" rounded="lger">
                            <span class="text-h6">Gropius</span>
                        </v-btn>
                    </router-link>
                </div>
            </slot>
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
    </div>
</template>
<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { useTheme } from "vuetify/lib/framework.mjs";

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

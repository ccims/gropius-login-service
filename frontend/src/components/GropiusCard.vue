<template>
    <v-card color="surface-elevated-2" rounded="xl" elevation="0" class="px-4 py-3 mt-5 pb-4">
        <div class="d-flex align-center justify-center" :class="{ 'position-relative': goBack }">
            <img src="@/assets/logo.svg" width="50" /><span class="text-primary text-h4 ml-2">Gropius</span>
            <IconButton v-if="goBack" class="position-absolute top-0 left-0" @click="goBack">
                <v-icon icon="mdi-arrow-left" />
                <v-tooltip activator="parent">Back</v-tooltip>
            </IconButton>
        </div>
        <slot />
    </v-card>
</template>
<script setup lang="ts">
defineProps<{
    goBack?: () => void;
}>();
</script>

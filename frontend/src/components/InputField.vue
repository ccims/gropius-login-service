<template>
    <v-text-field
        :label="field.displayName ?? field.name"
        :name="field.name"
        v-model="model"
        :type="isPasswordVisible || field.type != 'password' ? 'text' : 'password'"
        :append-inner-icon="field.type == 'password' ? (isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off') : undefined"
        @click:appendInner="isPasswordVisible = !isPasswordVisible"
    ></v-text-field>
</template>
<script setup lang="ts">
import { LoginStrategyVariable } from "@/views/model";
import { PropType, ref } from "vue";

defineProps({
    field: {
        type: Object as PropType<LoginStrategyVariable>,
        required: true
    }
});

const model = defineModel({
    type: String
});

const isPasswordVisible = ref(false);
</script>

<template>
    <v-dialog v-model="dialog" activator="parent" persistent width="auto">
        <v-card rounded="lger" class="pa-3" elevation="0" max-width="500">
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text>
                {{ message }}
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <DefaultButton variant="text" color="" @click="cancel">{{ cancelText }}</DefaultButton>
                <DefaultButton variant="text" color="error" @click="confirm">{{ confirmText }}</DefaultButton>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";

defineProps({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    confirmText: {
        type: String,
        default: "Confirm"
    },
    cancelText: {
        type: String,
        default: "Cancel"
    }
});

const model = defineModel({
    type: Boolean,
    default: false
});

const emit = defineEmits(["confirm", "cancel"]);

const dialog = ref(model.value);

watch(model, (value) => {
    dialog.value = value;
});

watch(dialog, (value) => {
    model.value = value;
});

function cancel() {
    dialog.value = false;
    emit("cancel");
}

function confirm() {
    dialog.value = false;
    emit("confirm");
}

defineExpose({
    dialog
});
</script>

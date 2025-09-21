<template>
    <BaseLayout>
        <template #content>
            <Markdown
                :model-value="legalInformation?.text ?? 'Loading...'"
                :edit-mode="false"
                :editable="false"
                class="pa-8"
            />
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import Markdown from "@/components/Markdown.vue";
import { withErrorMessage } from "@/util/withErrorMessage";
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

interface LegalInformation {
    id: string;
    label: string;
    text: string;
}

const route = useRoute();

const legalInformationId = computed(() => route.params.legalInformation as string);

const legalInformation = ref<LegalInformation>();

watch(
    legalInformationId,
    async (newId) => {
        legalInformation.value = await withErrorMessage(
            async () => (await axios.get(`/auth/api/internal/legal-information/${newId}`)).data.legalInformation,
            "Could not fetch legal information"
        );
    },
    { immediate: true }
);
</script>

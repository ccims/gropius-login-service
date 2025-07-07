<template>
    <BaseLayout>
        <template #content>
            <GropiusCard class="prompt-container mt-5 mb-4">
                <v-card-title class="text-center mb-4">Permission Prompt</v-card-title>

                <v-card-text>
                    {{ clientName }} wants to access your account <code>{{ username }}</code>.
                    This includes also your linked accounts.
                    If you grant access, you will be redirected to
                    
                    <br/>
                    <br/>

                    <code>{{  redirectUrl  }}</code>

                    <br/>
                    <br/>

                    <DefaultButton class="w-100 mb-4" @click="onGrant">Grant Access</DefaultButton>
                    <DefaultButton class="w-100" @click="onReject" variant="outlined">Reject Access</DefaultButton>
                </v-card-text>

            </GropiusCard>
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import GropiusCard from "@/components/GropiusCard.vue";
import * as oauth from '../util/oauth'

// TODO: get display infos
const username = "USER NAME"
const clientName = "CLIENT NAME"
const redirectUrl = "http://localhost:3000/auth/flow/prompt"

// TODO: get redirect infos
function onGrant() {
    // TODO: redirect user with code
}

// Redirect user without code but with error to client
function onReject() {
    oauth.rejectAccess(redirectUrl)
}

</script>
<style scoped>
.prompt-container {
    max-width: 500px;
    margin: 0 auto;
}
</style>

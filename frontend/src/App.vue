<template>
    <router-view />
</template>

<script lang="ts" setup></script>
<style>
body,
html,
#app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden !important;
}

::-webkit-scrollbar {
    width: 9px !important;
    height: 9px !important;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    border: 3px solid transparent;
    border-radius: 10px;
    background: rgba(var(--v-theme-on-surface), 0.25);
    background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
    border: 0;
}

::-webkit-scrollbar-corner {
    visibility: hidden;
}

.v-tooltip.rich-tooltip > .v-overlay__content {
    background: rgb(var(--v-theme-surface-container));
    color: rgb(var(--v-theme-on-surface-container));
    padding: 12px;
    border-radius: 12px;
    box-shadow:
        0 3px 3px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
        0 3px 4px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
        0 1px 8px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12)) !important;
}

.border-medium-emphasis {
    --v-border-opacity: var(--v-medium-emphasis-opacity) !important;
}

.flex-1-1-0 {
    flex: 1 1 0 !important;
}

.text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pointer-events-all {
    pointer-events: all;
}

.v-btn-group.segmented-button {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    flex-shrink: 0;
}

.v-switch .v-selection-control:not(.v-selection-control--dirty) .v-switch__track {
    border: solid 2px rgb(var(--v-theme-outline));
}

.v-switch .v-selection-control:not(.v-selection-control--dirty) .v-switch__thumb {
    background-color: rgb(var(--v-theme-outline));
}

.v-switch .v-selection-control.v-selection-control--dirty .v-switch__thumb {
    background-color: rgb(var(--v-theme-on-primary));
}

.v-stepper .v-window {
    overflow-y: auto;
    margin: 10px;
    padding: 10px;
}

.v-stepper .v-stepper-header {
    border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    flex-shrink: 0;
}

.v-field .v-field__outline {
    color: rgb(var(--v-theme-outline));
}
.v-field.v-field--error:hover:not(.v-field--focused) .v-field__outline {
    color: rgb(var(--v-theme-on-error-container));
}

.v-field:not(.v-field--focused) .v-label.v-field-label {
    color: rgb(var(--v-theme-on-surface-variant));
}
.v-field.v-field--error:hover:not(.v-field--focused) .v-label.v-field-label {
    color: rgb(var(--v-theme-on-error-container));
}

.v-field:hover .v-field__outline {
    color: rgb(var(--v-theme-on-surface));
}

.v-label {
    opacity: 1 !important;
}
</style>

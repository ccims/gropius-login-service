<template>
    <div>
        <div>
            <MdPreview
                v-model="model"
                language="en-US"
                :theme="theme.current.value.dark ? 'dark' : 'light'"
                preview-theme="github"
                :data-code-theme="theme.current.value.dark ? 'dark' : 'light'"
                :code-foldable="false"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { MdPreview } from "md-editor-v3";
import { useTheme } from "vuetify";

const theme = useTheme();

const model = defineModel({
    type: String,
    default: ""
});

defineProps({
    editMode: {
        type: Boolean,
        required: true
    },
    editable: {
        type: Boolean,
        required: true
    }
});
</script>
<style lang="scss">
@use "sass:meta";

*[data-code-theme="dark"] {
    @include meta.load-css("highlight.js/styles/github-dark.css");
}
*[data-code-theme="light"] {
    @include meta.load-css("highlight.js/styles/github.css");
}

.md-editor {
    --md-color: rgb(var(--v-theme-on-surface));
    --md-bk-color: transparent;
    --md-border-color: rgb(var(--v-theme-outline-variant));
    --md-scrollbar-bg-color: transparent;
    --md-bk-color-outstand: rgb(var(--v-theme-primary-container));
    border: none;

    .md-editor-dropdown-overlay {
        background: rgb(var(--v-theme-surface-container-low));
    }
}

.md-editor div.github-theme {
    --md-theme-code-before-bg-color: rgb(var(--v-theme-surface-elevated-2));
}

.md-editor.editor {
    height: max(300px, 30vh);
}

.md-editor .md-editor-resize-operate {
    border-left: 1px solid var(--md-border-color);
}

.md-editor-code-flag {
    visibility: hidden;
}

.md-editor-preview .md-editor-code pre code {
    border-radius: var(--md-theme-code-block-radius) !important;
}

.md-editor-code-head {
    position: absolute !important;
    right: 0;
    width: unset !important;
}

.md-editor-preview {
    font-family: "Roboto", sans-serif !important;

    h1 {
        font-weight: 400 !important;
    }
    h2 {
        font-weight: 450 !important;
    }
    h3,
    h4,
    h5,
    h6 {
        font-weight: 500 !important;
    }

    & > *:first-child {
        margin-top: 0 !important;
    }

    & > *:last-child {
        margin-bottom: 0 !important;
    }

    .contains-task-list {
        padding: 0 !important;

        .task-list-item {
            padding: 2px 15px 2px 42px;
            margin-right: -15px;
            margin-left: -15px;

            .handle {
                display: none;
            }

            &.hovered .handle {
                display: block;
                float: left;
                width: 20px;
                padding: 2px 0 0 2px;
                margin-left: -43px;

                .drag-handle {
                    fill: var(--md-theme-color);
                }
            }
        }
        li:not(.task-list-item) {
            margin-left: 24px;
        }
    }
}
</style>

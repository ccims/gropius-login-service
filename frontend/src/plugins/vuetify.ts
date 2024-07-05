import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import { generateThemeColors } from "./theme";
import { VBtn, VContainer, VListItemTitle } from "vuetify/lib/components/index.mjs";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const themeIndependentVariables = {
    "hover-opacity": 0.08
};

export default createVuetify({
    theme: {
        themes: {
            light: {
                colors: generateThemeColors("#2196f3", false),
                variables: {
                    ...themeIndependentVariables
                }
            },
            dark: {
                colors: generateThemeColors("#2196f3", true),
                variables: {
                    ...themeIndependentVariables
                }
            }
        },
        variations: false
    },
    blueprint: md3,
    aliases: {
        FAB: VBtn,
        SmallFAB: VBtn,
        IconButton: VBtn,
        DefaultButton: VBtn
    },
    defaults: {
        VTextField: {
            variant: "outlined",
            density: "comfortable",
            color: "primary"
        },
        VTextarea: {
            variant: "outlined",
            density: "comfortable",
            color: "primary"
        },
        VSelect: {
            variant: "outlined",
            density: "comfortable"
        },
        VAutocomplete: {
            variant: "outlined",
            density: "comfortable"
        },
        VCheckbox: {
            density: "comfortable",
            color: "primary"
        },
        VTooltip: {
            openDelay: 250
        },
        DefaultButton: {
            height: "40px",
            color: "primary",
            rounded: "xl"
        },
        FAB: {
            width: "56px",
            height: "56px",
            minWidth: 0,
            rounded: "lger"
        },
        SmallFAB: {
            width: "40px",
            height: "40px",
            minWidth: 0,
            rounded: "lg"
        },
        IconButton: {
            icon: true,
            variant: "text",
            color: "tertiary",
            density: "comfortable"
        },
        VChip: {
            rounded: "pill"
        },
        VBtnToggle: {
            variant: "outlined",
            color: "primary",
            divided: true,
            border: 5
        },
        VSwitch: {
            color: "primary",
            inset: true,
            density: "comfortable",
            hideDetails: true
        }
    },
    components: {
        VContainer,
        VListItemTitle
    },
    icons: {
        defaultSet: "mdi",
        aliases: {
            ...aliases
        },
        sets: {
            mdi
        }
    }
});

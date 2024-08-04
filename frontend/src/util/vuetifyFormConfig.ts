import { InputBindsConfig } from "vee-validate";

export const fieldConfig: any = {
    props: (state: any) => {
        return {
            "error-messages": state.errors
        };
    }
};

/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import router from "../router";

// Types
import type { App } from "vue";
import mdEditor from "./mdEditor";

export function registerPlugins(app: App) {
    app.use(vuetify).use(router).use(mdEditor);
}

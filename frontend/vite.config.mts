// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import Fonts from "unplugin-fonts/vite";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/auth/flow",
    plugins: [
        vue({
            template: {
                transformAssetUrls
            }
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
        vuetify({
            autoImport: true,
            styles: {
                configFile: "src/styles/settings.scss"
            }
        }),
        Fonts({
            fontsource: {
                families: [
                    {
                        name: "Roboto",
                        weights: [100, 300, 400, 500, 700, 900]
                    }
                ]
            }
        })
    ],
    define: { "process.env": {} },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        },
        extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
    },
    server: {
        port: 3000,
        proxy: {
            "/auth/oauth": {
                target: "http://localhost:3001",
                changeOrigin: true,
                secure: false,
                ws: true
            },
            "/auth/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
                secure: false,
                ws: true
            }
        }
    },
    preview: {
        port: 3000,
        proxy: {
            "/auth/oauth": {
                target: "http://localhost:3001",
                changeOrigin: true,
                secure: false,
                ws: true
            },
            "/auth/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
                secure: false,
                ws: true
            }
        }
    },
    optimizeDeps: {
        exclude: ["vuetify"]
    }
});

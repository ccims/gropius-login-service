import { config, XSSPlugin } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

import screenfull from "screenfull";

import katex from "katex";
import "katex/dist/katex.min.css";

import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

import mermaid from "mermaid";

import highlight from "highlight.js";

import * as prettier from "prettier";
import parserMarkdown from "prettier/plugins/markdown";

import mdit from "markdown-it";

import type { App } from "vue";

const initLineEndNumber = (md: mdit) => {
    md.core.ruler.push("init-line-end-number", (state) => {
        state.tokens.forEach((token) => {
            if (token.map) {
                if (!token.attrs) {
                    token.attrs = [];
                }
                token.attrs.push(["data-line-end", token.map[1].toString()]);
            }
        });
        return true;
    });
};

export default {
    install(app: App) {
        config({
            editorExtensions: {
                prettier: {
                    prettierInstance: prettier,
                    parserMarkdownInstance: parserMarkdown
                },
                highlight: {
                    instance: highlight
                },
                screenfull: {
                    instance: screenfull
                },
                katex: {
                    instance: katex
                },
                cropper: {
                    instance: Cropper
                },
                mermaid: {
                    instance: mermaid
                }
            },
            markdownItConfig(md) {
                initLineEndNumber(md);
            },
            markdownItPlugins(plugins) {
                return [
                    ...plugins,
                    {
                        type: "xss",
                        plugin: XSSPlugin,
                        options: {}
                    }
                ];
            }
        });
    }
};

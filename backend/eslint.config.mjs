import globals from "globals";
import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
    {
        ignores: ["dist/**", "eslint.config.mjs", "**/generated*", "src/database-migrations/**"],
    },
    ...tseslint.configs.recommended,
    prettierRecommended,
    {
        languageOptions: {
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            parserOptions: {
                // Replaces the old `project: "tsconfig.json"`; required by the
                // type-aware `no-floating-promises` rule below.
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            indent: ["warn", 4, { SwitchCase: 1 }],
            "max-len": ["error", { code: 120, ignoreUrls: true }],
            "@typescript-eslint/no-floating-promises": ["error"],
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
);

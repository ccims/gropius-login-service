import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: [
        {
            "http://localhost:8081/graphql": {
                headers: {
                    Authorization: `Bearer ${process.env.GROPIUS_INTERNAL_BACKEND_TOKEN}`,
                },
            },
        },
    ],
    documents: ["src/**/*.ts", "src/**/*.graphql", "!src/model/graphql/generated/**"],
    generates: {
        "src/model/graphql/generated/": {
            preset: "client",
            config: {
                useTypeImports: true,
                scalars: {
                    DateTime: "any",
                    JSON: "any",
                    URL: "any",
                },
            },
            presetConfig: {
                fragmentMasking: false,
            },
        },
    },
};
export default config;

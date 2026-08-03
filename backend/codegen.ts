import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    // The internal API rejects unauthenticated introspection, so the same token the service uses at
    // runtime has to be passed here as well.
    schema: [
        {
            "http://localhost:8081/graphql": {
                headers: {
                    Authorization: `Bearer ${process.env.GROPIUS_INTERNAL_BACKEND_TOKEN}`,
                },
            },
        },
    ],
    // Operations live next to the code that runs them, shared fragments in src/model/graphql/fragments.
    // The generated output itself has to be excluded, otherwise codegen would pick up its own documents.
    documents: ["src/**/*.ts", "src/**/*.graphql", "!src/model/graphql/generated/**"],
    generates: {
        "src/model/graphql/generated/": {
            preset: "client",
            config: {
                useTypeImports: true,
                // Without this the custom scalars end up as `unknown`, which does not survive being
                // handed to the JSONField helpers or to the strategies.
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

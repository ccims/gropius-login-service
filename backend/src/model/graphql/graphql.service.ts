import { Injectable, Optional } from "@nestjs/common";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLClient } from "graphql-request";

type Variables = Record<string, unknown>;
type VariablesArgs<V extends Variables> = V extends Record<any, never> ? [variables?: V] : [variables: V];

@Injectable()
export class GraphqlService {
    private readonly client: GraphQLClient;

    constructor(
        @Optional()
        internalApiEndpoint = process.env.GROPIUS_INTERNAL_BACKEND_ENDPOINT,
        @Optional()
        internalApiToken = process.env.GROPIUS_INTERNAL_BACKEND_TOKEN,
    ) {
        this.client = new GraphQLClient(internalApiEndpoint, {
            headers: {
                Authorization: internalApiToken ? "Bearer " + internalApiToken : undefined,
            },
        });
    }

    /**
     * Executes an operation against the backend.
     *
     * The document is expected to come from `graphql()` of the generated client, which types both
     * result and variables, so callers can keep their operations next to the code that runs them.
     *
     * @param document The operation to execute
     * @param variables The variables of the operation, omittable if it has none
     * @returns The data of the response
     */
    request<TResult, TVariables extends Variables>(
        document: TypedDocumentNode<TResult, TVariables>,
        ...variables: VariablesArgs<TVariables>
    ): Promise<TResult> {
        return this.client.request<TResult, TVariables>(document, ...variables);
    }
}

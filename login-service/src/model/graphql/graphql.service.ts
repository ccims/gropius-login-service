import { Injectable, Optional } from "@nestjs/common";
import { getSdk } from "./generated";
import { GraphQLClient, RequestDocument, RequestOptions, Variables } from "graphql-request";
import { RemoveIndex } from "graphql-request/dist/types";

@Injectable()
export class GraphqlService {
    private readonly client: GraphQLClient;
    public readonly sdk: ReturnType<typeof getSdk>;

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
        this.sdk = getSdk(this.client);
    }
}

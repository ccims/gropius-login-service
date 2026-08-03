import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { graphql } from "../model/graphql/generated/index.js";
import type {
    BaseLegalInformationInfoFragment,
    DefaultLegalInformationInfoFragment,
} from "../model/graphql/generated/graphql.js";
import { GraphqlService } from "../model/graphql/graphql.service.js";
import { OpenApiTag } from "../util/openapi-tag.js";

class LegalInformationListReturn {
    constructor(readonly legalInformation: BaseLegalInformationInfoFragment[]) {}
}

class LegalInformationReturn {
    constructor(readonly legalInformation: DefaultLegalInformationInfoFragment) {}
}

const legalInformationQuery = graphql(`
    query legalInformation {
        legalInformation(orderBy: [{ field: PRIORITY, direction: ASC }]) {
            nodes {
                ...BaseLegalInformationInfo
            }
        }
    }
`);

const getLegalInformationQuery = graphql(`
    query getLegalInformation($id: ID!) {
        node(id: $id) {
            ... on LegalInformation {
                ...DefaultLegalInformationInfo
            }
        }
    }
`);

@Controller("legal-information")
@ApiTags(OpenApiTag.INTERNAL_API)
export class LegalinformationController {
    constructor(private readonly graphqlService: GraphqlService) {}

    @Get()
    @ApiOperation({ summary: "Get the legal information" })
    @ApiOkResponse({
        description: "The labels, priorities and ids of all legal informations",
        type: LegalInformationListReturn,
    })
    async legalInformation() {
        const legalInformation = await this.graphqlService.request(legalInformationQuery);
        return new LegalInformationListReturn(legalInformation.legalInformation.nodes);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a specific legal information by id" })
    @ApiOkResponse({
        description: "The full legal information with the given id",
        type: LegalInformationReturn,
    })
    async getLegalInformationById(@Param("id") id: string) {
        const result = await this.graphqlService.request(getLegalInformationQuery, { id });
        return new LegalInformationReturn(result.node as DefaultLegalInformationInfoFragment);
    }
}

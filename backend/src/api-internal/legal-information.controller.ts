import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BaseLegalInformationInfoFragment, DefaultLegalInformationInfoFragment } from "src/model/graphql/generated";
import { GraphqlService } from "src/model/graphql/graphql.service";
import { OpenApiTag } from "src/util/openapi-tag";

class LegalInformationListReturn {
    constructor(readonly legalInformation: BaseLegalInformationInfoFragment[]) {}
}

class LegalInformationReturn {
    constructor(readonly legalInformation: DefaultLegalInformationInfoFragment) {}
}

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
        const legalInformation = await this.graphqlService.sdk.legalInformation();
        return new LegalInformationListReturn(legalInformation.legalInformation.nodes);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a specific legal information by id" })
    @ApiOkResponse({
        description: "The full legal information with the given id",
        type: LegalInformationReturn,
    })
    async getLegalInformationById(@Param("id") id: string) {
        const result = await this.graphqlService.sdk.getLegalInformation({ id });
        return new LegalInformationReturn(result.node as DefaultLegalInformationInfoFragment);
    }
}

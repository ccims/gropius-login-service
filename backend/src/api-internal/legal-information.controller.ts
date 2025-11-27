import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GraphqlService } from "src/model/graphql/graphql.service";
import { OpenApiTag } from "src/util/openapi-tag";

/**
 * Represents basic legal information details
 */
class BaseLegalInformationDto {
    /**
     * The unique ID of the legal information
     * @example "12345678-90ab-cdef-fedc-ab0987654321"
     */
    id: string;
    
    /**
     * The label/title of the legal information
     * @example "Terms of Service"
     */
    label: string;
    
    /**
     * The priority/order of the legal information
     * @example 1
     */
    priority: number;
}

/**
 * Represents complete legal information including the full text
 */
class DefaultLegalInformationDto extends BaseLegalInformationDto {
    /**
     * The full text content of the legal information
     * @example "By using this service, you agree to..."
     */
    text: string;
}

/**
 * Response containing a list of legal information items
 */
class LegalInformationListReturn {
    /**
     * Array of legal information items
     */
    legalInformation: BaseLegalInformationDto[];
    
    constructor(legalInformation: any[]) {
        this.legalInformation = legalInformation;
    }
}

/**
 * Response containing a single legal information item with full details
 */
class LegalInformationReturn {
    /**
     * The legal information item
     */
    legalInformation: DefaultLegalInformationDto;
    
    constructor(legalInformation: any) {
        this.legalInformation = legalInformation;
    }
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
        return new LegalInformationReturn(result.node);
    }
}

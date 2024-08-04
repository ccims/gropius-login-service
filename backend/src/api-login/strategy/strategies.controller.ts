import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common";
import { StrategiesService } from "src/model/services/strategies.service";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { GetStrategyResponse } from "./dto/strategy-api.dto";
import { OpenApiTag } from "src/openapi-tag";

/**
 * Controller providing (read only) access to existing strategies (strategy types)
 */
@Controller()
@ApiTags(OpenApiTag.LOGIN_API)
export class StrategiesController {
    constructor(private readonly strategiesService: StrategiesService) {}

    /**
     * Returns all known strategies (strategy types) that are registered in the system
     *
     * @returns List of strategies (types) registered in the system
     */
    @Get("strategy")
    @ApiOperation({ summary: "List all strategies/strategy types" })
    @ApiOkResponse({
        type: [GetStrategyResponse],
        description: "All known strategies in the system",
    })
    getAllStrategyTypes(): GetStrategyResponse[] {
        return this.strategiesService.getAllStrategies();
    }

    /**
     * Gets details for the one specified strategy type
     *
     * @param type The strategy type name of the strategy to retrieve
     * @returns The strategy (type) referenced by the name
     */
    @Get("strategy/:type")
    @ApiOperation({ summary: "Get one strategy (type)" })
    @ApiParam({ name: "type", type: String, description: "The strategy type name of the strategy to retrieve" })
    @ApiOkResponse({
        type: GetStrategyResponse,
        description: "If existing, the strategy specified",
    })
    @ApiNotFoundResponse({
        description: "If no strategy with the specified type name exists",
    })
    getStrategyType(@Param("type") type: string): GetStrategyResponse {
        if (!this.strategiesService.hasStrategy(type)) {
            throw new HttpException("Strategy type does not exist", HttpStatus.NOT_FOUND);
        }
        return this.strategiesService.getStrategyByName(type);
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { CheckLoginServiceAccessTokenGuard } from "src/api-login/auth/check-login-service-access-token.guard";
import { DefaultReturn } from "src/default-return.dto";
import { StrategyInstance } from "src/model/postgres/StrategyInstance.entity";
import { StrategyInstanceService } from "src/model/services/strategy-instance.service";
import { StrategiesService } from "src/model/services/strategies.service";
import { CreateStrategyInstanceInput } from "./dto/create-strategy-instance.dto";
import { UpdateStrategyInstanceInput } from "./dto/update-strategy-instance.dto";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import { OpenApiTag } from "src/openapi-tag";
import { StrategyInstanceDetailResponse } from "./dto/get-strategy-instance-detail.dto";
import { NeedsAdmin } from "src/util/NeedsAdmin";

/**
 * Controller for providing crud access to login strategy instances.
 *
 * They can either be accessed as sub nodes of the strategy or top level
 */
@Controller()
@ApiTags(OpenApiTag.LOGIN_API)
export class StrategyInstancesController {
    private readonly logger = new Logger(StrategyInstancesController.name);
    constructor(
        private readonly strategiesService: StrategiesService,
        private readonly strategyInstanceService: StrategyInstanceService,
    ) {}

    /**
     * Gets the list of all Strategy instances.
     * If a type is specified, only the instances of that type will be retrieved.
     *
     * If a non existant strategy type name ist specified, no instances will be returned.
     *
     * @param type The strategy type of which to request the instances. Optional. If not given, get all instances
     * @returns A list of all instances (of the specified type)
     */
    @Get(["strategy-instance", "strategy/:type/instance"])
    @ApiOperation({ summary: "List all strategy instances (of type)" })
    @ApiParam({
        name: "type",
        type: String,
        description: "The strategy type name. If not given gets all instances",
        required: false,
    })
    @ApiOkResponse({ type: [StrategyInstance], description: "The list of all strategy instances" })
    async getAllStrategyInstances(@Param("type") type: string): Promise<StrategyInstance[]> {
        if (type) {
            return this.strategyInstanceService.findBy({ type });
        } else {
            return this.strategyInstanceService.find();
        }
    }

    /**
     * Gets one strategy instance by the specified id.
     * If the type is specified, only instances of that type will be looked at
     *
     * @param id The uuid string of an existing strategy instance to get
     * @param type The strategy type name of which to search for the instance. Defaults to all types
     * @returns The strategy instance with the given id (and type)
     */
    @Get(["strategy-instance/:id", "strategy/:type/instance/:id"])
    @UseGuards(CheckLoginServiceAccessTokenGuard)
    @NeedsAdmin()
    @ApiOperation({ summary: "Get one strategy instance" })
    @ApiParam({
        name: "id",
        type: String,
        format: "uuid",
        description: "The uuid string of an existing strategy instance to get",
    })
    @ApiParam({
        name: "type",
        type: String,
        description: "The strategy type name of which to search for the instance. Defaults to all types",
    })
    @ApiOkResponse({
        type: StrategyInstanceDetailResponse,
        description: "The requested strategy instance wiht additional data for its use",
    })
    @ApiNotFoundResponse({ description: "If no strategy with the given id (and type) are found" })
    async getStrategyInstance(
        @Param("id") id: string,
        @Param("type") type?: string,
    ): Promise<StrategyInstanceDetailResponse> {
        const instance = await this.strategyInstanceService.findOneBy({
            id,
            type,
        });
        if (!instance) {
            throw new HttpException(
                "Id is not a valid strategy instance id (of that strategy type)",
                HttpStatus.NOT_FOUND,
            );
        }
        const strategy = this.strategiesService.getStrategyByName(instance.type);
        return {
            id: instance.id,
            name: instance.name,
            type: instance.type,
            isLoginActive: instance.isLoginActive,
            isSelfRegisterActive: instance.isSelfRegisterActive,
            isSyncActive: instance.isSyncActive,
            doesImplicitRegister: instance.doesImplicitRegister,
            instanceConfig: strategy.getCensoredInstanceConfig(instance),
        };
    }

    /**
     * Creates a new strategy instance.
     *
     * The type of the instance is set at creation and cannot change later.
     * The type from the url takes precedene.
     * If that is not present, the type from the body will be used.
     *
     * The required structure of the `instanceConfig` is specified by the strategy.
     *
     * @param input The data on which to create the new strategy instance
     * @param type The type of the new strategy instance. If not given as url parameter, must be given in the body
     * @returns The created strategy instance object
     */
    @Post(["strategy-instance", "strategy/:type/instance"])
    @UseGuards(CheckLoginServiceAccessTokenGuard)
    @NeedsAdmin()
    @ApiOperation({ summary: "Create new strategy instance" })
    @ApiParam({
        name: "type",
        type: String,
        description: "The type of the new strategy instance. If not given as url parameter, must be given in the body",
        required: false,
    })
    @ApiOkResponse({ type: StrategyInstance, description: "If successful, the created strategy instance object" })
    @ApiBadRequestResponse({ description: "If the input data was invalid" })
    @ApiBearerAuth()
    async createNewInstance(
        @Body() input: CreateStrategyInstanceInput,
        @Param("type") type?: string,
    ): Promise<StrategyInstance> {
        input.type = type || input.type;
        CreateStrategyInstanceInput.check(input);
        const strategy = this.strategiesService.getStrategyByName(input.type);
        if (!strategy) {
            throw new HttpException(
                "Strategy with given type name does not exist or wasn't given",
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            return strategy.createOrUpdateNewInstance(input);
        } catch (err) {
            this.logger.warn("Error on strategy instance creation", err);
            throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Updates the values of an existing strategy instance.
     *
     * The type can not be updated.
     * Only values given in the body will be modified on the instance.
     *
     * @param input The data to modify the strategy instance to
     * @param id The uuid string of the strategy instance to edit
     * @param type The type the instance to modify is. Can be left out, defaults to all types.
     * @returns If successful, the updated strategy instance.
     */
    @Put(["strategy-instance/:id", "strategy/:type/instance/:id"])
    @UseGuards(CheckLoginServiceAccessTokenGuard)
    @NeedsAdmin()
    @ApiOperation({ summary: "Edit an existing strategy instance" })
    @ApiParam({
        name: "id",
        type: String,
        format: "uuid",
        description: "The uuid string of an existing strategy instance to edit",
    })
    @ApiParam({
        name: "type",
        type: String,
        description: "The strategy type name of which to search for the instance. Defaults to all types",
    })
    @ApiOkResponse({
        type: StrategyInstance,
        description: "If successful, the updated strategy instance",
    })
    @ApiNotFoundResponse({ description: "If no strategy with the given id (and type) are found" })
    @ApiBadRequestResponse({ description: "If any of the input values are invalid" })
    @ApiBearerAuth()
    async updateStrategyInstance(
        @Body() input: UpdateStrategyInstanceInput,
        @Param("id") id: string,
        @Param("type") type?: string,
    ): Promise<StrategyInstance> {
        UpdateStrategyInstanceInput.check(input);

        const instance = await this.strategyInstanceService.findOneBy({
            id,
            type,
        });
        if (!instance) {
            throw new HttpException("id is not a valid strategy instance id", HttpStatus.NOT_FOUND);
        }
        const stragety = this.strategiesService.getStrategyByName(instance.type);
        if (!stragety) {
            throw new Error(`Strategy ${instance.type} for instance ${instance.id} not found`);
        }
        return stragety.createOrUpdateNewInstance(input, instance);
    }

    /**
     * Permanently deletes the login strategy instance with the given id.
     *
     * @param id The uuid string of the strategy instance to delete
     * @param type The strategy type name of the strategy instance to delete
     * @returns If successfull, a default response with operation "delete-strategyInstance"
     */
    @Delete(["strategy-instance/:id", "strategy/:type/instance/:id"])
    @UseGuards(CheckLoginServiceAccessTokenGuard)
    @NeedsAdmin()
    @ApiOperation({ summary: "Delete a strategy instance" })
    @ApiParam({
        name: "id",
        type: String,
        format: "uuid",
        description: "The uuid string of an existing strategy instance to delete",
    })
    @ApiParam({
        name: "type",
        type: String,
        description: "The strategy type name of which to search for the instance. Defaults to all types",
    })
    @ApiOkResponse({
        type: DefaultReturn,
        description: "If successfull, a default response with operation 'delete-strategyInstance'",
    })
    @ApiNotFoundResponse({ description: "If no strategy with the given id (and type) are found" })
    @ApiBearerAuth()
    async deleteStrategyInstance(@Param("id") id: string, @Param("type") type?: string): Promise<DefaultReturn> {
        const instance = await this.strategyInstanceService.findOneBy({
            id,
            type,
        });
        if (!instance) {
            throw new HttpException("id is not a valid strategy instance id", HttpStatus.NOT_FOUND);
        }
        await this.strategyInstanceService.remove(instance);
        return new DefaultReturn("delete-strategyInstance");
    }
}

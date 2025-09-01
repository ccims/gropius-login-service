import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Put, UseGuards } from "@nestjs/common";
import { ImsUserFindingService } from "src/backend-services/ims-user-finding.service";
import { DefaultReturn } from "src/util/default-return.dto";
import { UserLoginDataImsUser } from "src/model/postgres/UserLoginDataImsUser.entity";
import { UserLoginDataImsUserService } from "src/model/services/user-login-data-ims-user";
import { StrategiesService } from "src/model/services/strategies.service";
import { CheckSyncSecretGuard } from "./check-sync-secret.guard";
import { GetImsTokenResult } from "./dto/get-ims-token.dto";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/util/openapi-tag";
import { LinkImsUsersInputDto } from "./dto/link-ims-users-input.dto";

@Controller()
@UseGuards(CheckSyncSecretGuard)
@ApiTags(OpenApiTag.SYNC_API)
@ApiBearerAuth(OpenApiTag.SYNC_API)
export class SyncImsUserController {
    private readonly logger = new Logger(SyncImsUserController.name);
    constructor(
        private readonly imsUserService: UserLoginDataImsUserService,
        private readonly strategyService: StrategiesService,
        private readonly imsUserFindingService: ImsUserFindingService,
    ) {}

    @Get("get-ims-token/:id")
    @ApiOperation({ summary: "Get the IMS token for a given IMS user id" })
    @ApiParam({ name: "id", description: "The neo4j id of the IMS user", required: true })
    @ApiOkResponse({ type: GetImsTokenResult })
    @ApiBadRequestResponse({ description: "Missing query parameter imsUser or failed to load referenced IMS user" })
    async getIMSToken(@Param("id") imsUserId: string): Promise<GetImsTokenResult> {
        if (!imsUserId || imsUserId.trim().length == 0) {
            throw new HttpException("Missing query parameter imsUser", HttpStatus.BAD_REQUEST);
        }
        let imsUser: UserLoginDataImsUser;
        try {
            imsUser = await this.imsUserService.findOneBy({
                neo4jId: imsUserId,
            });
        } catch (err: any) {
            this.logger.warn("Error loading imsuser by neo4jId", err);
            throw new HttpException("Could not load ims user by id; Check the id syntax", HttpStatus.BAD_REQUEST);
        }
        if (!imsUser) {
            return {
                token: null,
                isImsUserKnown: false,
                message: "No ims user known for this id",
            };
        }
        const loginData = await imsUser.loginData;
        const strategyInstance = await loginData.strategyInstance;
        const strategy = this.strategyService.getStrategyByName(strategyInstance.type);
        return {
            ...(await strategy.getSyncDataForLoginData(loginData)),
            isImsUserKnown: true,
            message: null,
        };
    }

    //todo: make endpoint accept list of ims users to be linked all at once in order to optimize finding
    @Put("link-ims-users")
    @ApiOperation({ summary: "Link IMS users to the system" })
    @ApiOkResponse({ type: DefaultReturn })
    async linkIMSUser(@Body() input: LinkImsUsersInputDto): Promise<DefaultReturn> {
        LinkImsUsersInputDto.check(input);
        for (const imsUserId of input.imsUserIds) {
            await this.imsUserFindingService.createAndLinkSingleImsUser(imsUserId);
        }
        return new DefaultReturn("linkIMSUser");
    }
}

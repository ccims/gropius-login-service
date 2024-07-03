import {
    All,
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    Put,
    Query,
    Res,
    SetMetadata,
    UseGuards,
} from "@nestjs/common";
import { ImsUserFindingService } from "src/backend-services/ims-user-finding.service";
import { DefaultReturn } from "src/default-return.dto";
import { UserLoginDataImsUser } from "src/model/postgres/UserLoginDataImsUser.entity";
import { UserLoginDataImsUserService } from "src/model/services/user-login-data-ims-user";
import { StrategiesService } from "src/model/services/strategies.service";
import { CheckSyncSecretGuard } from "./check-sync-secret.guard";
import { GetImsTokenResult } from "./dto/GetImsTokenResult";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { OpenApiTag } from "src/openapi-tag";

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

    @Get("getIMSToken")
    async getIMSToken(@Query("imsUser") imsUserId: string): Promise<GetImsTokenResult> {
        if (!imsUserId || imsUserId.trim().length == 0) {
            throw new HttpException("Missing query parameter imsUser", HttpStatus.BAD_REQUEST);
        }
        let imsUser: UserLoginDataImsUser;
        try {
            imsUser = await this.imsUserService.findOneBy({
                neo4jId: imsUserId,
            });
        } catch (err) {
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
    @Put("linkIMSUser")
    async linkIMSUser(@Query("imsUser") imsUserId: string): Promise<DefaultReturn> {
        if (!imsUserId || imsUserId.trim().length == 0) {
            throw new HttpException("Missing query parameter imsUser", HttpStatus.BAD_REQUEST);
        }
        await this.imsUserFindingService.createAndLinkSingleImsUser(imsUserId);
        return new DefaultReturn("linkIMSUser");
    }
}

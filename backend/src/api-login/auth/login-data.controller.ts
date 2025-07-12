import { Controller, Get, HttpException, HttpStatus, Param, Res, UseGuards } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { UserLoginDataResponse } from "./dto/user-login-data.dto";
import { Response } from "express";
import { ApiStateData } from "src/util/ApiStateData";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { StrategiesService } from "src/model/services/strategies.service";
import { OpenApiTag } from "src/openapi-tag";
import { CheckLoginServiceAccessTokenGuard } from "./check-login-service-access-token.guard";

@Controller("login-data")
@UseGuards(CheckLoginServiceAccessTokenGuard)
@ApiTags(OpenApiTag.LOGIN_API)
@ApiBearerAuth()
export class LoginDataController {
    constructor(
        private readonly loginDataSerive: UserLoginDataService,
        private readonly backendUserService: BackendUserService,
        private readonly strategiesService: StrategiesService,
    ) {}

    /**
     * Gets the list of all login data of a single user specified by id.
     *
     * Needs admin permission for any user other than the one sending the request
     * (equivalen to self query).
     *
     * @param id The uuid string of the existing user to get the loginData for or 'self'
     * @param res The response object containing the request state
     * @returns If user exits, login data for the user with the specified id
     */
    @Get(":id")
    @ApiOperation({ summary: "Get a loginData by id" })
    @ApiParam({
        name: "id",
        type: String,
        format: "uuid",
        description: "The uuid string of the loginData to get",
    })
    @ApiOkResponse({
        type: UserLoginData,
        description: "login data for the specified id",
    })
    @ApiNotFoundResponse({ description: "If no loginData with the specified id could be found" })
    @ApiUnauthorizedResponse({ description: "If no requesting self and not admin or if login is invalid" })
    async getLoginData(
        @Param("id") id: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<UserLoginDataResponse> {
        if (!id) {
            throw new HttpException("id must be given", HttpStatus.BAD_REQUEST);
        }
        const loggedInUser = (res.locals.state as ApiStateData).loggedInUser;
        const loginData = await this.loginDataSerive.findOne({
            where: {
                id,
            },
            relations: ["strategyInstance"],
        });
        if ((await loginData.user).id != loggedInUser.id) {
            if (!(await this.backendUserService.checkIsUserAdmin(loggedInUser))) {
                throw new HttpException(
                    "No permission to access others login data if not admin",
                    HttpStatus.UNAUTHORIZED,
                );
            }
        }
        const instance = await loginData.strategyInstance;
        const strategy = this.strategiesService.getStrategyByName(instance.type);

        return {
            id: loginData.id,
            state: loginData.state,
            expires: loginData.expires,
            strategyInstance: instance,
            description: await strategy.getLoginDataDescription(loginData),
        } satisfies UserLoginDataResponse;
    }
}

import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Param,
    Put,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import { ApiStateData } from "src/util/ApiStateData";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { OpenApiTag } from "src/util/openapi-tag";
import { Response } from "express";
import { CheckAuthAccessTokenGuard } from "./check-auth-access-token.guard";
import { StrategiesService } from "src/model/services/strategies.service";
import { DefaultReturn } from "src/util/default-return.dto";
import { NoCors } from "../util/NoCors.decorator";

@Controller("update-action")
@ApiTags(OpenApiTag.INTERNAL_API)
@UseGuards(CheckAuthAccessTokenGuard)
export class UpdateActionController {
    constructor(
        private readonly backendUserService: BackendUserService,
        private readonly loginDataService: UserLoginDataService,
        private readonly strategyService: StrategiesService,
    ) {}

    @Put(":id/:action")
    @NoCors()
    @ApiOperation({ summary: "Update a login data with a specific action" })
    @ApiParam({ name: "id", type: String, description: "The id of the login data to update" })
    @ApiParam({ name: "action", type: String, description: "The action to perform on the login data" })
    @ApiOkResponse({
        description: "If update action succeeded, the default response",
        type: DefaultReturn,
    })
    @ApiNotFoundResponse({ description: "If no login data with the given id are found" })
    @ApiBadRequestResponse({ description: "If any of the input values are invalid" })
    @ApiBearerAuth()
    async updateAction(
        @Body() input: object,
        @Param("id") id: string,
        @Param("action") action: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const loginData = await this.loginDataService.findOneBy({ id });
        if (!loginData) {
            throw new HttpException("id is not a valid login data id", HttpStatus.NOT_FOUND);
        }
        const loggedInUser = (res.locals.state as ApiStateData).loggedInUser;
        if (loggedInUser.id != (await loginData.user).id) {
            const isAdmin = await this.backendUserService.checkIsUserAdmin(loggedInUser);
            if (!isAdmin) {
                throw new UnauthorizedException(undefined, "Not sufficient permission to request non self");
            }
        }
        const strategyInstance = await loginData.strategyInstance;
        const strategy = this.strategyService.getStrategyByName(strategyInstance.type);
        await strategy.handleAction(loginData, action, input);
        return new DefaultReturn(action);
    }
}

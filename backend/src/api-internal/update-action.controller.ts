import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Param,
    Post,
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
import type { ApiStateData } from "../util/ApiStateData.js";
import { BackendUserService } from "../backend-services/backend-user.service.js";
import { UserLoginDataService } from "../model/services/user-login-data.service.js";
import { OpenApiTag } from "../util/openapi-tag.js";
import type { Response } from "express";
import { CheckAuthAccessTokenGuard } from "./check-auth-access-token.guard.js";
import { StrategiesService } from "../model/services/strategies.service.js";
import { DefaultReturn } from "../util/default-return.dto.js";
import { ActiveLoginService } from "../model/services/active-login.service.js";

@Controller("update-action")
@ApiTags(OpenApiTag.INTERNAL_API)
@UseGuards(CheckAuthAccessTokenGuard)
export class UpdateActionController {
    constructor(
        private readonly backendUserService: BackendUserService,
        private readonly loginDataService: UserLoginDataService,
        private readonly strategyService: StrategiesService,
        private readonly activeLoginService: ActiveLoginService,
    ) {}

    @Post(":id/delete")
    @ApiOperation({ summary: "Delete a login data" })
    @ApiParam({ name: "id", type: String, description: "The id of the login data to delete" })
    @ApiOkResponse({
        description: "If deletion succeeded, the default response",
        type: DefaultReturn,
    })
    @ApiNotFoundResponse({ description: "If no login data with the given id are found" })
    @ApiBadRequestResponse({ description: "If any of the input values are invalid" })
    @ApiBadRequestResponse({ description: "If only one login data exists" })
    @ApiBearerAuth()
    async deleteAction(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
        const loginData = await this.getLoginData(id, res);

        const loginDataCount = await this.loginDataService.countBy({
            user: { id: (await loginData.user).id },
            strategyInstance: { isLoginActive: true },
        });
        if (loginDataCount == 1) {
            throw new HttpException(`Can't delete the only login-capable login data of a user`, HttpStatus.BAD_REQUEST);
        }

        await this.activeLoginService.delete({ loginInstanceFor: { id: loginData.id } });
        await this.loginDataService.delete({ id: loginData.id });

        return new DefaultReturn("delete");
    }

    @Put(":id/:action")
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
        const loginData = await this.getLoginData(id, res);
        const strategyInstance = await loginData.strategyInstance;
        const strategy = this.strategyService.getStrategyByName(strategyInstance.type);
        await strategy.handleAction(loginData, action, input);
        return new DefaultReturn(action);
    }

    private async getLoginData(id: string, res: Response) {
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

        return loginData;
    }
}

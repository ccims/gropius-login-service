import { Body, Controller, HttpException, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Response } from "express";
import { DefaultReturn } from "src/default-return.dto";
import { LoginUserService } from "src/model/services/login-user.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { OpenApiTag } from "src/openapi-tag";
import { ApiStateData } from "./ApiStateData";
import { CheckAccessTokenGuard, NeedsAdmin } from "./check-access-token.guard";
import { CheckRegistrationTokenService } from "./check-registration-token.service";
import { AdminLinkUserInput, RegistrationTokenInput } from "./dto/link-user.dto";

/**
 * Controller for handling self registration of new users as well as linking of existing users to new loginData
 */
@Controller("registration")
@ApiTags(OpenApiTag.LOGIN_API)
export class RegisterController {
    constructor(
        private readonly checkRegistrationTokenService: CheckRegistrationTokenService,
        private readonly loginDataService: UserLoginDataService,
        private readonly userService: LoginUserService,
    ) {}

    /**
     * Links a new authentication with a strategy instance with the currently logged in user.
     * For future logins using that authentication the user will be directly found
     *
     * A (still) valid registration token is needed.
     * After a successful linking, the expiration of the activeLogin and loginData will be updated accoringly
     * @param input The input containing the registration token obtained from the authentication flow
     * @param res The response object of the server containing the state with the logged in user
     * @returns The default response with operation 'self-link'
     */
    @Post("self-link")
    @UseGuards(CheckAccessTokenGuard)
    @ApiOperation({ summary: "Link new authentication with current user" })
    @ApiOkResponse({
        type: DefaultReturn,
        description: "If successful, the default response with operation 'self-link'",
    })
    @ApiUnauthorizedResponse({
        description:
            "If no user is logged in " +
            ", the given registration token is not/no longer valid or the registration time frame has expired",
    })
    @ApiBearerAuth()
    async selfLink(
        @Body() input: RegistrationTokenInput,
        @Res({ passthrough: true }) res: Response,
    ): Promise<DefaultReturn> {
        RegistrationTokenInput.check(input);
        //todo: potentially move to POST user/:id/loginData
        if (!(res.locals.state as ApiStateData).loggedInUser) {
            throw new HttpException("Not logged in", HttpStatus.UNAUTHORIZED);
        }
        const { loginData, activeLogin } = await this.checkRegistrationTokenService.getActiveLoginAndLoginDataForToken(
            input.register_token,
            (res.locals.state as ApiStateData).loggedInUser,
        );
        const { loggedInUser } = await this.loginDataService.linkAccountToUser(
            (res.locals.state as ApiStateData).loggedInUser,
            loginData,
            activeLogin,
        );
        (res.locals.state as ApiStateData).loggedInUser = loggedInUser;
        return new DefaultReturn("self-link");
    }

    /**
     * Links a new authentication with any user specified by id
     *
     * Needs admin permissions
     *
     * A (still) valid registration token is needed.
     * After a successful linking, the expiration of the activeLogin and loginData will be updated accoringly
     * @param input The input with the registration_token and the user id of the user to link
     * @param res The response object of the server containing the state with the logged in user
     * @returns The default response with operation 'admin-link'
     */
    @Post("admin-link")
    @UseGuards(CheckAccessTokenGuard)
    @NeedsAdmin()
    @ApiOperation({ summary: "Links new authentication with any user by id" })
    @ApiOkResponse({
        type: DefaultReturn,
        description: "If successful, the default response with operation 'admin-link'",
    })
    @ApiUnauthorizedResponse({
        description:
            "If not an admin is logged in, " +
            "the given registration token is not/no longer valid or the registration time frame has expired",
    })
    @ApiNotFoundResponse({ description: "If the specified user id did not match any existing user" })
    @ApiBearerAuth()
    async adminLink(
        @Body() input: AdminLinkUserInput,
        @Res({ passthrough: true }) res: Response,
    ): Promise<DefaultReturn> {
        // requires: admin and specification of user id to link with
        //todo: potentially move to POST user/:id/loginData
        AdminLinkUserInput.check(input);
        const linkToUser = await this.userService.findOneBy({
            id: input.userIdToLink,
        });
        if (!linkToUser) {
            throw new HttpException("No user with given user_to_link_to_id", HttpStatus.NOT_FOUND);
        }
        const { loginData, activeLogin } = await this.checkRegistrationTokenService.getActiveLoginAndLoginDataForToken(
            input.register_token,
            linkToUser,
        );
        await this.loginDataService.linkAccountToUser(linkToUser, loginData, activeLogin);
        return new DefaultReturn("admin-link");
    }
}

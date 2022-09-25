import {
    All,
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Res,
    SetMetadata,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Response } from "express";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { TokenService } from "src/backend-services/token.service";
import { DefaultReturn } from "src/default-return.dto";
import { ActiveLogin } from "src/model/postgres/ActiveLogin.entity";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { LoginState, UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { ActiveLoginService } from "src/model/services/active-login.service";
import { LoginUserService } from "src/model/services/login-user.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { OpenApiTag } from "src/openapi-tag";
import { ApiStateData } from "./ApiStateData";
import { CheckAccessTokenGuard, NeedsAdmin } from "./check-access-token.guard";
import { CheckRegistrationTokenService } from "./check-registration-token.service";
import { AdminLinkUserInput, RegistrationTokenInput } from "./dto/link-user.dto";
import { SelfRegisterUserInput } from "./dto/user-inputs.dto";

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
        private readonly activeLoginService: ActiveLoginService,
        private readonly backendUserSerivce: BackendUserService,
    ) {}

    /**
     * Given user data and a registration token, this will create a new user for the registration.
     * The user will also be created in the backend.
     *
     * For the creation to succeed, the registration token and the registration may not be expired yet.
     *
     * @param input The input data for creating a new user
     * @returns The default return with operation "self-register"
     */
    @Post("self-register")
    @ApiOperation({ summary: "Self register (create user) using registration token" })
    @ApiOkResponse({
        type: DefaultReturn,
        description: "If successful, the Default Return with operation 'self-register'",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the given registration token is not/no longer valid or the registration time frame has expired",
    })
    @ApiBadRequestResponse({
        description: "If any of the input data for the user creation are invalid or the username is already taken",
    })
    async register(@Body() input: SelfRegisterUserInput): Promise<DefaultReturn> {
        SelfRegisterUserInput.check(input);
        const { loginData, activeLogin } = await this.checkRegistrationTokenService.getActiveLoginAndLoginDataForToken(
            input.register_token,
        );
        if ((await this.userService.countBy({ username: input.username })) > 0) {
            throw new HttpException("Username is not available anymore", HttpStatus.BAD_REQUEST);
        }
        const newUser = await this.backendUserSerivce.createNewUser(input, false);
        const { loggedInUser } = await this.linkAccountToUser(newUser, loginData, activeLogin);
        return new DefaultReturn("self-register");
    }

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
        const { loggedInUser } = await this.linkAccountToUser(
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
        await this.linkAccountToUser(linkToUser, loginData, activeLogin);
        return new DefaultReturn("admin-link");
    }

    /**
     * Helper function performing tha actual linking of login data with user.
     *
     * If the given login data already has a user set, the user must match the given one,
     * else a INTERNAL_SERVER_ERROR is raised.
     *
     * The expiration of the loginData will be removed.
     * The expiration of the activeLogin will be set to the default login expiration time,
     * except if the strategy supports sync, then the active login will never expire.
     * The state of the loginData will be updated to VALID if it was WAITING_FOR_REGISER before
     *
     * @param userToLinkTo The user account to link the new authentication to
     * @param loginData The new authentication to link to the user
     * @param activeLogin The active login that was created during the authentication flow
     * @returns The saved and updated user and login data after linking
     */
    private async linkAccountToUser(
        userToLinkTo: LoginUser,
        loginData: UserLoginData,
        activeLogin: ActiveLogin,
    ): Promise<{ loggedInUser: LoginUser; loginData: UserLoginData }> {
        if (!userToLinkTo) {
            throw new HttpException(
                "Not logged in to any account. Linking not possible. Try logging in or registering",
                HttpStatus.BAD_REQUEST,
            );
        }
        if (loginData.state == LoginState.WAITING_FOR_REGISTER) {
            loginData.state = LoginState.VALID;
        }
        const currentLoginDataUser = await loginData.user;
        if (currentLoginDataUser == null) {
            loginData.user = Promise.resolve(userToLinkTo);
        } else {
            if (currentLoginDataUser.id !== userToLinkTo.id) {
                // Shoud not be reachable as this is already checked in token check
                throw new HttpException(
                    "Login data user did not match logged in user",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
        loginData.expires = null;
        loginData = await this.loginDataService.save(loginData);

        await this.activeLoginService.setActiveLoginExpiration(activeLogin);

        userToLinkTo = await this.userService.findOneBy({
            id: userToLinkTo.id,
        });

        await this.backendUserSerivce.linkAllImsUsersToGropiusUser(userToLinkTo, loginData);
        return { loggedInUser: userToLinkTo, loginData };
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
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
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Response } from "express";
import { BackendUserService } from "src/backend-services/backend-user.service";
import { DefaultReturn } from "src/default-return.dto";
import { LoginUser } from "src/model/postgres/LoginUser.entity";
import { UserLoginData } from "src/model/postgres/UserLoginData.entity";
import { LoginUserService } from "src/model/services/login-user.service";
import { UserLoginDataService } from "src/model/services/user-login-data.service";
import { OpenApiTag } from "src/openapi-tag";
import { ApiStateData } from "./ApiStateData";
import { CheckAccessTokenGuard, NeedsAdmin } from "./check-access-token.guard";
import { CreateUserAsAdminInput } from "./dto/user-inputs.dto";

/**
 * Controller allowing access to the users in the system
 */
@Controller("user")
@UseGuards(CheckAccessTokenGuard)
@ApiTags(OpenApiTag.LOGIN_API)
@ApiBearerAuth()
export class UsersController {
    constructor(
        private readonly userService: LoginUserService,
        private readonly backendUserSerice: BackendUserService,
        private readonly loginDataSerive: UserLoginDataService,
    ) {}

    /**
     * Gets a list of all users in the system.
     *
     * Needs admin permissions.
     *
     * @returns List of all users in the system
     */
    @Get()
    @ApiOperation({ summary: "List all users in the system" })
    @ApiOkResponse({ type: [LoginUser], description: "List of all users in the system" })
    @NeedsAdmin()
    async listAllUsers(): Promise<LoginUser[]> {
        return this.userService.find();
    }

    /**
     * Gets the user object of the logged in user that is sending the request.
     *
     * @param res The response object containing the request state
     * @returns The user details of the logged in user
     */
    @Get("self")
    @ApiOperation({ summary: "Get logged in user details" })
    @ApiOkResponse({ type: LoginUser, description: "The user details of the logged in user" })
    async getOwnUser(@Res({ passthrough: true }) res: Response): Promise<LoginUser> {
        return (res.locals.state as ApiStateData).loggedInUser;
    }

    /**
     * Get the user object of any user by its id.
     *
     * Needs admin permission for any user other than the one sending the request
     * (equivalen to self query).
     *
     * @param id The uuid string of the user to get the details for
     * @returns If existing and permitted, the user details of the requested user
     */
    @Get(":id")
    @ApiOperation({ summary: "Get any user object by id" })
    @ApiParam({
        name: "id",
        type: String,
        format: "uuid",
        description: "The uuid string of the user to get the details for",
    })
    @ApiOkResponse({
        type: LoginUser,
        description: "If existing and permitted, the user details of the requested user",
    })
    @ApiUnauthorizedResponse({ description: "If not logged in or requesting a non-self user and not admin" })
    @ApiNotFoundResponse({ description: "If no user with the given id was found" })
    async getOneUser(@Param("id") id: string, @Res({ passthrough: true }) res: Response): Promise<LoginUser> {
        const loggedInUser = (res.locals.state as ApiStateData).loggedInUser;
        if (loggedInUser.id != id) {
            const isAdmin = await this.backendUserSerice.checkIsUserAdmin(loggedInUser);
            if (!isAdmin) {
                throw new UnauthorizedException(undefined, "Not sufficient permission to request non self");
            }
        }
        const user = await this.userService.findOneBy({ id });
        if (!user) {
            throw new HttpException("User with given id not found", HttpStatus.NOT_FOUND);
        }
        return user;
    }

    /**
     * Create a new user object (which has no authentications yet) based on the given data.
     *
     * Needs admin permissions.
     *
     * Meant for admins to create users which can then be linked a authentication by a admin.
     * Can be used, if self registration os turned off for all strategies globally.
     *
     * @param input Input data to create a new user from
     * @returns If uscessful, the created user object
     */
    @Post()
    @ApiOperation({ summary: "Create a new user without authentication" })
    @ApiOkResponse({ type: LoginUser, description: "If uscessful, the created user object" })
    @ApiBadRequestResponse({
        description: "If the input data for the user is invalid or the username is already taken",
    })
    @NeedsAdmin()
    async createNewUser(@Body() input: CreateUserAsAdminInput): Promise<LoginUser> {
        CreateUserAsAdminInput.check(input);
        if ((await this.userService.countBy({ username: input.username })) > 0) {
            throw new HttpException("Username is not available anymore", HttpStatus.BAD_REQUEST);
        }
        return this.backendUserSerice.createNewUser(input, input.isAdmin);
    }

    /**
     * **NOTE**: Not implemented yet. Will always fail.
     *
     * Updates an existing user object using the given data.
     * Only the entries that are given in the input will be updated in the user.
     *
     * Needs Admin permissions
     *
     * @param id The uuid string of the existing user to edit
     * @param input If sucessful, the updated user object
     */
    @Put(":id")
    @ApiOperation({ summary: "NOT IMPLEMENTED! Update an existing user object" })
    @ApiParam({ name: "id", type: String, format: "uuid", description: "The uuid string of the existing user to edit" })
    @ApiOkResponse({ type: LoginUser, description: "If sucessful, the updated user object" })
    @ApiNotFoundResponse({ description: "If no user with the given id could be found" })
    @NeedsAdmin()
    async editUser(@Param("id") id: string, @Body() input: Partial<CreateUserAsAdminInput>): Promise<LoginUser> {
        throw new HttpException(
            "Needs to be discussed with backend who stores what and what changes where",
            HttpStatus.NOT_IMPLEMENTED,
        );
        const user = await this.userService.findOneBy({ id });
        if (!user) {
            throw new HttpException("User with given id not found", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * **NOTE**: Not implemented yet. Will always fail.
     *
     * Permanently deletes an existing user by its id.
     *
     * Needs Admin permissions
     *
     * @param id The uuid string of the existing user to delete
     * @param input The default response with operation 'delete-user'
     */
    @Delete(":id")
    @ApiOperation({ summary: "NOT IMPLEMENTED! Update an existing user object" })
    @ApiParam({ name: "id", type: String, format: "uuid", description: "The uuid string of the existing user to edit" })
    @ApiOkResponse({ type: LoginUser, description: "If sucessful, the updated user object" })
    @ApiNotFoundResponse({ description: "If no user with the given id could be found" })
    async deleteUser(@Param("id") id: string): Promise<DefaultReturn> {
        throw new HttpException(
            "I'm not supposed to say wht I think. But why this isn't yet implemented is difficult to explain.",
            HttpStatus.NOT_IMPLEMENTED,
        );
        return new DefaultReturn("delete-user");
    }

    /**
     * Gets the list of all login data of a single user specified by id.
     *
     * Needs admin permission for any user other than the one sending the request
     * (equivalen to self query).
     *
     * @param id The uuid string of the existing user to get the loginData for or 'self'
     * @param res The response object containing the request state
     * @returns If user exixts, login data for the user with the specified id
     */
    @Get(":id/loginData")
    @ApiOperation({ summary: "List all loginData of one user" })
    @ApiParam({
        name: "id",
        type: String,
        format: "uuid",
        description: "The uuid string of the existing user to get the loginData for or 'self'",
    })
    @ApiOkResponse({
        type: [UserLoginData],
        description: "If user exixts, login data for the user with the specified id",
    })
    @ApiNotFoundResponse({ description: "If no user with the specified it could be found" })
    @ApiUnauthorizedResponse({ description: "If no requesting self and not admin or if login is invalid" })
    async getLoginDataForUser(
        @Param("id") id: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<UserLoginData[]> {
        if (!id) {
            throw new HttpException("id must be given", HttpStatus.BAD_REQUEST);
        }
        const loggedInUser = (res.locals.state as ApiStateData).loggedInUser;
        if (id == "self") {
            id = loggedInUser.id;
        }
        if (id != loggedInUser.id) {
            if (!this.backendUserSerice.checkIsUserAdmin(loggedInUser)) {
                throw new HttpException(
                    "No permission to access others login data if not admin",
                    HttpStatus.UNAUTHORIZED,
                );
            }
        }
        return this.loginDataSerive.findBy({
            user: {
                id: loggedInUser.id,
            },
        });
    }
}

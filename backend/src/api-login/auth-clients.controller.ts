import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import { DefaultReturn } from "src/default-return.dto";
import { AuthClient } from "src/model/postgres/AuthClient.entity";
import { AuthClientService } from "src/model/services/auth-client.service";
import { OpenApiTag } from "src/openapi-tag";
import { CheckLoginServiceAccessTokenGuard } from "./check-login-service-access-token.guard";
import { CreateAuthClientSecretResponse } from "./dto/create-auth-client-secret.dto";
import { CreateOrUpdateAuthClientInput } from "./dto/create-update-auth-client.dto";
import { CensoredClientSecret, GetAuthClientResponse } from "./dto/get-auth-client.dto";
import { NeedsAdmin } from "src/util/NeedsAdmin";

/**
 * Controller for all queries related to auth clients and their client secrets
 *
 * All requests require authentication and admin access.
 *
 * Route prefix: client
 */
@Controller("client")
@UseGuards(CheckLoginServiceAccessTokenGuard)
@ApiBearerAuth()
@ApiTags(OpenApiTag.LOGIN_API)
export class AuthClientController {
    constructor(private readonly authClientService: AuthClientService) {}

    /**
     * Gets all auth clients that exist in the system.
     * Client secrets are not returned.
     *
     * Needs admin permissions
     *
     * @returns A list of all existing auth clients
     */
    @Get()
    @NeedsAdmin()
    @ApiOkResponse({
        type: [AuthClient],
        description: "List of all auth clients",
    })
    @ApiOperation({ summary: "List all existing auth clients." })
    async listAllAuthClients(): Promise<AuthClient[]> {
        return [...this.authClientService.defaultAuthClients, ...(await this.authClientService.find())];
    }

    /**
     * Gets one specific auth clients by its uuid.
     * This will also include the list of censored client secrets (see GET /login/client/:id/clientSecret)
     *
     * Needs admin permissions
     *
     * @param id The uuid string of an existing auth client to return
     * @returns The requested auth client including the censored client secrets (see GET /login/client/:id/clientSecret)
     */
    @Get(":id")
    @NeedsAdmin()
    @ApiOperation({ summary: "Details of one auth client (incl. censored secrets)" })
    @ApiParam({
        name: "id",
        type: String,
        description: "The id string of an existing auth client to return",
    })
    @ApiOkResponse({
        type: GetAuthClientResponse,
        description: "The auth client with the requested id",
    })
    @ApiNotFoundResponse({
        description: "If no id was given or no auth client with the given id was found",
    })
    async getOneAuthClient(@Param("id") id: string): Promise<GetAuthClientResponse> {
        const authClient = await this.authClientService.findAuthClient(id);
        if (!authClient) {
            throw new HttpException("Auth client with given id not found", HttpStatus.NOT_FOUND);
        }
        return {
            ...authClient.toJSON(),
            censoredClientSecrets: authClient.getSecretsShortedAndFingerprint(),
        };
    }

    /**
     * Creates a new auth client.
     *
     * Redirect urls defaults to empty list.
     * If no redirectURLs are specified the client will be unusable until they are updated.
     * If `requiresSecret` is `true`, authorization as this client won't work until a client secret is added
     * (see POST /login/client/:id/clientSecret).
     *
     * Needs admin persmissions.
     *
     * @param input The input data for the new auth client
     * @returns The newly created auth client instance
     */
    @Post()
    @NeedsAdmin()
    @ApiOperation({ summary: "Create new auth client" })
    @ApiCreatedResponse({
        type: [AuthClient],
        description: "The auth client that was created",
    })
    @ApiBadRequestResponse({
        description: "If the input data didn't match the schema",
    })
    async createNewAuthClient(@Body() input: CreateOrUpdateAuthClientInput): Promise<AuthClient> {
        CreateOrUpdateAuthClientInput.check(input);
        const newClient = new AuthClient();
        if (input.name) {
            newClient.name = input.name;
        } else {
            newClient.name = null;
        }
        newClient.redirectUrls = [];
        if (input.redirectUrls) {
            for (const url of input.redirectUrls) {
                newClient.redirectUrls.push(url);
            }
        }
        if (input.isValid != undefined) {
            newClient.isValid = input.isValid;
        } else {
            newClient.isValid = true;
        }
        newClient.clientSecrets = [];
        if (input.requiresSecret !== undefined) {
            newClient.requiresSecret = input.requiresSecret;
        } else {
            newClient.requiresSecret = true;
        }
        newClient.validScopes = [];
        if (input.validScopes) {
            for (const scope of input.validScopes) {
                newClient.validScopes.push(scope);
            }
        }

        return this.authClientService.save(newClient);
    }

    /**
     * Updates the auth client with the given ID.
     * Only parameter given in the input will be changed.
     *
     * If `redirectUrls` is given, it wil replace **all** previous URLs.
     * Merging (if needed) needs to be done by the client.
     *
     * @param id The uuid string of an existing auth client
     * @param input The input data dto
     * @returns The auth client with the updated data
     */
    @Put(":id")
    @NeedsAdmin()
    @ApiOperation({ summary: "Edit existing auth client" })
    @ApiParam({ name: "id", format: "uuid", type: String, description: "The uuid string of an existing auth client" })
    @ApiOkResponse({
        description: "The auth client was successfully updated",
        type: AuthClient,
    })
    @ApiBadRequestResponse({
        description: "If the input data didn't match the schema",
    })
    @ApiNotFoundResponse({
        description: "If no id was given or no auth client with the given id was found",
    })
    async editAuthClient(@Param("id") id: string, @Body() input: CreateOrUpdateAuthClientInput): Promise<AuthClient> {
        CreateOrUpdateAuthClientInput.check(input);

        const authClient = await this.authClientService.findOneBy({ id });
        if (!authClient) {
            throw new HttpException(
                "Auth client with given id not found or is default auth client",
                HttpStatus.NOT_FOUND,
            );
        }

        if (input.name) {
            authClient.name = input.name;
        }
        if (input.redirectUrls) {
            authClient.redirectUrls = [];
            for (const url of input.redirectUrls) {
                authClient.redirectUrls.push(url);
            }
        }
        if (input.isValid != undefined) {
            authClient.isValid = input.isValid;
        }
        if (input.requiresSecret != undefined) {
            authClient.requiresSecret = input.requiresSecret;
        }
        if (input.validScopes) {
            authClient.validScopes = [];
            for (const scope of input.validScopes) {
                authClient.validScopes.push(scope);
            }
        }

        return this.authClientService.save(authClient);
    }

    /**
     * Permanently deletes an existing auth client by its id.
     *
     * @param id The uuid string of an existing auth client to delete
     * @returns {@link DefaultReturn}
     */
    @Delete(":id")
    @NeedsAdmin()
    @ApiOperation({ summary: "Permanently delete existing auth client" })
    @ApiParam({
        name: "id",
        type: String,
        format: "uuid",
        description: "The uuid string of an existing auth client to delete",
    })
    @ApiOkResponse({
        description: "If deletion succeeded, the default response",
        type: DefaultReturn,
    })
    @ApiNotFoundResponse({
        description: "If no id was given or no auth client with the given id was found",
    })
    async deleteAuthClient(@Param("id") id: string): Promise<DefaultReturn> {
        const authClient = await this.authClientService.findOneBy({ id });
        if (!authClient) {
            throw new HttpException(
                "Auth client with given id not found or is default auth client",
                HttpStatus.NOT_FOUND,
            );
        }

        await this.authClientService.remove(authClient);

        return new DefaultReturn("delete-client");
    }

    /**
     * Retrieves all existing client secrets of the specified auth client.
     *
     * The returned secrets only contain the 5 letter prefix (censored client secret text)
     * and the fingerprint for identification (for deleting secrets).
     * The original secret text is **NOT** returned.
     * It can only be retrieved once while creating the secret.
     *
     * @param id The uuid string of an existing auth client
     * @returns All client secrets of the auth client (censored)
     */
    @Get(":id/client-secret")
    @NeedsAdmin()
    @ApiOperation({ summary: "List all client secrets (censored) of auth client" })
    @ApiParam({ name: "id", type: String, format: "uuid", description: "The uuid string of an existing auth client" })
    @ApiOkResponse({
        type: [CensoredClientSecret],
        description: "All client secrets of the auth client (censored)",
    })
    @ApiNotFoundResponse({
        description: "If no id was given or no auth client with the given id was found",
    })
    async getClientSecrets(@Param("id") id: string): Promise<CensoredClientSecret[]> {
        const authClient = await this.authClientService.findAuthClient(id);
        if (!authClient) {
            throw new HttpException("Auth client with given id not found", HttpStatus.NOT_FOUND);
        }

        return authClient.getSecretsShortedAndFingerprint();
    }

    /**
     * Generates a new client secret for the specified auth client.
     *
     * **NOTE**: The returned value includes the secret text that is the actual secret.
     * It can **NOT** be retrieved later on.
     * The censored version and fingerprint will be returned too for reference.
     *
     * @param id The uuid string of an existing auth client to create the secret for
     * @returns The generated client secret
     */
    @Post(":id/client-secret")
    @NeedsAdmin()
    @ApiOperation({ summary: "Generate and return new client secret for auth client" })
    @ApiParam({
        name: "id",
        type: String,
        format: "uuid",
        description: "The uuid string of an existing auth client to create the secret for",
    })
    @ApiCreatedResponse({
        type: CreateAuthClientSecretResponse,
        description:
            "If creation succeeded, the created client secret including the censored version and the fingerprint.",
    })
    @ApiNotFoundResponse({
        description: "If no id was given or no auth client with the given id was found",
    })
    async createClientSecret(@Param("id") id: string): Promise<CreateAuthClientSecretResponse> {
        const authClient = await this.authClientService.findOneBy({ id });
        if (!authClient) {
            throw new HttpException(
                "Auth client with given id not found or is default auth client",
                HttpStatus.NOT_FOUND,
            );
        }

        const result = await authClient.addSecret();

        await this.authClientService.save(authClient);

        return result;
    }

    /**
     * Deletes the client secret with the given fingerprint from the autch client with the given id
     *
     * @param id The uuid string of an existing auth client to delete
     * @param fingerprint The fingerprint returned by the clientSecrets endpoint to identify the client secret to delete
     * @returns The default response
     */
    @Delete(":id/client-secret/:fingerprint")
    @NeedsAdmin()
    @ApiOperation({ summary: "Delete a client secret of auch client" })
    @ApiParam({
        name: "id",
        type: String,
        format: "uuid",
        description: "The uuid string of an existing auth client to delete a client secret from",
    })
    @ApiParam({
        name: "fingerprint",
        type: String,
        description: "The fingerprint string of one of the existing client secrets of the client to delete",
    })
    @ApiOkResponse({
        type: DefaultReturn,
        description: 'If deletion was successfull, the default response with operation "delete-clientSecret"',
    })
    @ApiNotFoundResponse({
        description:
            "If no id or no fingerprint was given, no auth client with the given id was found " +
            "or no secret with the given fingerprint was found",
    })
    async deleteClientSecret(
        @Param("id") id: string,
        @Param("fingerprint") fingerprint: string,
    ): Promise<DefaultReturn> {
        if (!fingerprint) {
            throw new HttpException("Fingerprint of secret to delete expected", HttpStatus.BAD_REQUEST);
        }

        const authClient = await this.authClientService.findOneBy({ id });
        if (!authClient) {
            throw new HttpException(
                "Auth client with given id not found or is default auth client",
                HttpStatus.NOT_FOUND,
            );
        }

        const allSecrets = authClient.getFullHashesPlusCensoredAndFingerprint();
        const secretsToKeep = allSecrets
            .filter((entry) => entry.fingerprint != fingerprint)
            .map((entry) => entry.secret);
        if (allSecrets.length <= secretsToKeep.length) {
            throw new HttpException("No secret with given fingerprint", HttpStatus.NOT_FOUND);
        }

        authClient.clientSecrets = secretsToKeep;
        await this.authClientService.save(authClient);
        return new DefaultReturn("delete-clientSecret");
    }
}

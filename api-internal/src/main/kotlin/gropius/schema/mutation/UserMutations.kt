package gropius.schema.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Mutation
import gropius.dto.input.user.CreateGropiusUserInput
import gropius.dto.input.user.CreateIMSUserInput
import gropius.dto.input.user.UpdateIMSUserInput
import gropius.graphql.AutoPayloadType
import gropius.model.user.GropiusUser
import gropius.model.user.IMSUser
import gropius.service.user.GropiusUserService
import gropius.service.user.IMSUserService
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional

/**
 * Contains all User-related mutations
 *
 * @param gropiusUserService used for GropiusUser-related mutations
 * @param imsUserService used for IMSUser-related mutations
 */
@Component
@Transactional(propagation = Propagation.REQUIRES_NEW)
class UserMutations(
    private val gropiusUserService: GropiusUserService,
    private val imsUserService: IMSUserService
) : Mutation {

    @GraphQLDescription("Creates a GropiusUser")
    @AutoPayloadType("The created GropiusUser")
    suspend fun createGropiusUser(
        @GraphQLDescription("Defines the created GropiusUser")
        input: CreateGropiusUserInput,
    ): GropiusUser {
        return gropiusUserService.createGropiusUser(input)
    }

    @GraphQLDescription("Creates an IMSUser")
    @AutoPayloadType("The created IMSUser")
    suspend fun createIMSUser(
        @GraphQLDescription("Defines the created IMSUser")
        input: CreateIMSUserInput,
    ): IMSUser {
        return imsUserService.createIMSUser(input)
    }

    @GraphQLDescription("Updates an IMSUser")
    @AutoPayloadType("The updated IMSUser")
    suspend fun updateIMSUser(
        @GraphQLDescription("Defines the updated IMSUser")
        input: UpdateIMSUserInput,
    ): IMSUser {
        return imsUserService.updateIMSUser(input)
    }

}
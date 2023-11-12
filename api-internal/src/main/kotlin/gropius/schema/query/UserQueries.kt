package gropius.schema.query

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Query
import gropius.model.user.GropiusUser
import gropius.service.user.GropiusUserService
import org.springframework.stereotype.Component

/**
 * Contains all user-related queries
 *
 * @param gropiusUserService used for [GropiusUser]-related queries
 */
@Component
class UserQueries(private val gropiusUserService: GropiusUserService) : Query {

    @GraphQLDescription("Get a GropiusUser by username")
    suspend fun gropiusUser(
        @GraphQLDescription("The username of the GropiusUser to get")
        username: String
    ): GropiusUser {
        return gropiusUserService.findGropiusUserByUsername(username)
    }

    @GraphQLDescription("Get the IDs of all existing Gropius Users")
    suspend fun gropiusUserIds(): List<ID> {
        return gropiusUserService.findGropiusUserIds()
    }
}
package gropius.schema.query

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import gropius.authorization.GropiusAuthorizationContext
import gropius.authorization.checkPermission
import gropius.authorization.gropiusAuthorizationContext
import gropius.graphql.TypeGraphQLType
import gropius.model.user.GropiusUser
import gropius.model.user.permission.GLOBAL_PERMISSION_ENTRY_NAME
import gropius.repository.user.GropiusUserRepository
import io.github.graphglue.authorization.AuthorizationChecker
import io.github.graphglue.authorization.Permission
import io.github.graphglue.graphql.extensions.authorizationContext
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Component

/**
 * Contains all user-related queries
 *
 * @param gropiusUserRepository for getting [GropiusUser] by id
 * @param authorizationChecker used to check for permissions
 */
@Component
class UserQueries(
    private val gropiusUserRepository: GropiusUserRepository,
    private val authorizationChecker: AuthorizationChecker
) : Query {

    @GraphQLDescription("The current authenticated user")
    suspend fun currentUser(dfe: DataFetchingEnvironment): GropiusUser? {
        return if (dfe.authorizationContext is GropiusAuthorizationContext) {
            val userId = dfe.gropiusAuthorizationContext.userId
            gropiusUserRepository.findById(userId).awaitSingle()
        } else {
            null
        }
    }

    @GraphQLDescription("Checks if the current user has a specific global permission")
    suspend fun hasGlobalPermission(
        dfe: DataFetchingEnvironment,
        @GraphQLDescription("The permission to check for")
        permission: @TypeGraphQLType(GLOBAL_PERMISSION_ENTRY_NAME) String,
    ): Boolean {
        return if (dfe.checkPermission) {
            authorizationChecker.hasAuthorization(
                currentUser(dfe)!!,
                Permission(permission, dfe.authorizationContext!!)
            ).awaitSingle()
        } else {
            true
        }
    }

}
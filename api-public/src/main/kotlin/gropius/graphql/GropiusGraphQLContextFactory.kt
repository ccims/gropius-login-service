package gropius.graphql

import com.expediagroup.graphql.server.spring.execution.DefaultSpringGraphQLContextFactory
import gropius.GropiusPublicApiConfigurationProperties
import gropius.authorization.GropiusAuthorizationContext
import gropius.model.user.GropiusUser
import gropius.model.user.permission.NodePermission
import gropius.repository.user.GropiusUserRepository
import io.github.graphglue.authorization.AuthorizationContext
import io.github.graphglue.authorization.Permission
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.server.ResponseStatusException

/**
 * String that the audience claim of a JWT must contain for it to be accepted
 */
private val JWT_AUDIENCE_BACKEND = "backend";

/**
 * Generates the GraphQL context map
 *
 * @param gropiusUserRepository used to get the user
 * @param gropiusPublicApiConfigurationProperties used to determine if authentication is optional
 */
@Component
class GropiusGraphQLContextFactory(
    private val gropiusUserRepository: GropiusUserRepository,
    private val gropiusPublicApiConfigurationProperties: GropiusPublicApiConfigurationProperties
) : DefaultSpringGraphQLContextFactory() {

    /**
     * Jwt parser based on the secret defined by [gropiusPublicApiConfigurationProperties]
     */
    private val jwtParser = Jwts.parserBuilder()
        .setSigningKey(Keys.hmacShaKeyFor(Decoders.BASE64.decode(gropiusPublicApiConfigurationProperties.jwtSecret)))
        .build()

    override suspend fun generateContextMap(request: ServerRequest): Map<*, Any> {
        val token = request.headers().firstHeader("Authorization")
        val additionalContextEntries = if (token == null) {
            if (gropiusPublicApiConfigurationProperties.debugNoAuthentication) {
                emptyMap()
            } else {
                throw ResponseStatusException(HttpStatus.FORBIDDEN, "No authentication token provided")
            }
        } else {
            val user = verifyToken(token)
            val isAdmin = user.isAdmin || gropiusPublicApiConfigurationProperties.debugNoAuthentication
            val context = GropiusAuthorizationContext(user.rawId!!, !isAdmin)
            if (isAdmin) {
                mapOf(AuthorizationContext::class to context)
            } else {
                mapOf(Permission::class to Permission(NodePermission.READ, context))
            }

        }
        return super.generateContextMap(request) + additionalContextEntries
    }

    /**
     * Verifies a jwt and returns the [GropiusUser] defined by the id in subject
     *
     * @param token the jwt, possibly starting with `"Bearer "`
     * @return the user defined by the id in subject
     * @throws IllegalStateException if the user does not exist or if the jwt is invalid
     */
    private suspend fun verifyToken(token: String): GropiusUser {
        val tokenWithoutBearer = token.replace("Bearer ", "", true)
        val jwt = try {
            jwtParser.parseClaimsJws(tokenWithoutBearer)
        } catch (e: JwtException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid jwt")
        }
        if (!jwt.body.audience.contains(JWT_AUDIENCE_BACKEND)) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Not a backend token")
        }
        val user = jwt.body.subject!!
        return gropiusUserRepository.findById(user).awaitSingle()
    }

}
package gropius.sync

import gropius.model.architecture.IMS
import gropius.model.user.GropiusUser
import gropius.model.user.IMSUser
import gropius.model.user.User
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.data.neo4j.core.ReactiveNeo4jOperations
import org.springframework.data.neo4j.core.findById
import org.springframework.stereotype.Component
import java.net.URI
import java.util.*

/**
 * Configuration properties for the GitHub API
 *
 * @param loginServiceBase Base url for login service
 * @param apiSecret API Secret for login service
 */
@ConfigurationProperties("gropius.sync")
data class SyncConfigurationProperties(val loginServiceBase: URI, val apiSecret: String)

/**
 * Manager for token from login service
 * @param neoOperations Reference for the spring instance of ReactiveNeo4jOperations
 * @param syncConfigurationProperties Reference for the spring instance of GropiusGithubConfigurationProperties
 */
@Component
class TokenManager(
    @Qualifier("graphglueNeo4jOperations")
    private val neoOperations: ReactiveNeo4jOperations,
    private val syncConfigurationProperties: SyncConfigurationProperties
) {
    val client = HttpClient() {
        expectSuccess = true
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            })
            json(Json {
                ignoreUnknownKeys = true
            }, contentType = ContentType.parse("application/json; charset=utf-8"))
        }
    }

    /**
     * Logger used to print notifications
     */
    private val logger = LoggerFactory.getLogger(TokenManager::class.java)

    /**
     * Response of the getIMSToken login endpoint
     * @param token Token if available
     * @param isImsUserKnown True if the user exists and just has no token
     */
    @Serializable
    data class TokenResponse(val token: String?, val isImsUserKnown: Boolean)

    /**
     * Request an user token from the auth service
     * @param imsUser The IMSUser the token should be for
     * @return token if available
     */
    suspend fun getUserToken(imsUser: IMSUser): String? {
        val tokenResponse: TokenResponse = client.get(syncConfigurationProperties.loginServiceBase.toString()) {
            url {
                appendPathSegments("syncApi", "getIMSToken")
                parameters.append("imsUser", imsUser.rawId!!)
            }
            headers {
                append(HttpHeaders.Authorization, "Bearer " + syncConfigurationProperties.apiSecret)
            }
        }.body()
        return tokenResponse.token
    }

    /**
     * Load the token of from the login service
     * @param ims IMS the user has to belong to
     * @param readUser default user-id to fallback on
     * @param imsUser user to ask the token for
     * @return GitHub auth token
     */
    suspend fun getTokenForIMSUser(ims: IMS, readUser: String, imsUser: IMSUser?): String {
        val readUserInfo =
            imsUser ?: neoOperations.findById<IMSUser>(readUser) ?: throw SyncNotificator.NotificatedError(
                "SYNC_GITHUB_USER_NOT_FOUND"
            )
        if (readUserInfo.ims().value != ims) {
            throw SyncNotificator.NotificatedError(
                "SYNC_GITHUB_USER_INVALID_IMS"
            )
        }
        return getUserToken(readUserInfo) ?: throw SyncNotificator.NotificatedError(
            "SYNC_GITHUB_USER_NO_TOKEN"
        )
    }

    suspend fun getPossibleUsersForUser(ims: IMS, user: User): List<IMSUser> {
        val ret = mutableListOf<IMSUser>()
        if (user is IMSUser) {
            if (user.ims().value == ims) {
                ret.add(user)
            }
        }
        val gropiusUser = if (user is IMSUser) user.gropiusUser().value else user as GropiusUser
        if (gropiusUser != null) {
            for (imsUser in gropiusUser.imsUsers()) {
                if (imsUser.ims().value == ims) {
                    ret.add(imsUser)
                }
            }
        }
        return ret
    }

    suspend fun <T> executeUntilWorking(
        users: List<IMSUser>, executor: suspend (token: String) -> Optional<T>
    ): Pair<IMSUser, T> {
        for (user in users) {
            val token = getUserToken(user)
            if (token != null) {
                val ret = executor(token)
                if (ret.isPresent) {
                    return user to ret.get()
                }
            }
        }
        TODO("Error Message")
    }

    suspend fun <T> executeUntilWorking(
        ims: IMS, user: List<User>, executor: suspend (token: String) -> Optional<T>
    ): Pair<IMSUser, T> {
        val users = user.map { getPossibleUsersForUser(ims, it) }.flatten()
        logger.info("Expanding $user to $users")
        return executeUntilWorking(users, executor)
    }

    /**
     * Advertise to the login service that an IMSUser  has been created
     * @param user The user AFTER BEING SAVED TO DB (valid, non-null rawId)
     */
    suspend fun advertiseIMSUser(user: IMSUser) {
        client.put(syncConfigurationProperties.loginServiceBase.toString()) {
            url {
                appendPathSegments("syncApi", "linkIMSUser")
                parameters.append("imsUser", user.rawId!!)
            }
            headers {
                append(HttpHeaders.Authorization, "Bearer " + syncConfigurationProperties.apiSecret)
            }
        }
    }
}

package gropius.sync.github

import gropius.GropiusGithubConfigurationProperties
import gropius.model.user.IMSUser
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.neo4j.core.ReactiveNeo4jOperations
import org.springframework.data.neo4j.core.findById
import org.springframework.stereotype.Component

/**
 * Manager for token from login service
 * @param neoOperations Reference for the spring instance of ReactiveNeo4jOperations
 * @param gropiusGithubConfigurationProperties Reference for the spring instance of GropiusGithubConfigurationProperties
 */
@Component
class TokenManager(
    @Qualifier("graphglueNeo4jOperations")
    private val neoOperations: ReactiveNeo4jOperations,
    private val gropiusGithubConfigurationProperties: GropiusGithubConfigurationProperties
) {
    val client = HttpClient() {
        expectSuccess = true
    }

    /**
     * Response of the getIMSToken login endpoint
     * @param token Token if available
     * @param isImsUserKnown True if the user exists and just has no token
     */
    private data class TokenResponse(val token: String?, val isImsUserKnown: Boolean)

    /**
     * Request an user token from the auth service
     * @param imsUser The IMSUser the token should be for
     * @return token if available
     */
    suspend fun getGithubUserToken(imsUser: IMSUser): String? {
        val tokenResponse: TokenResponse =
            client.get(gropiusGithubConfigurationProperties.loginServiceBase.toString()) {
                url {
                    appendPathSegments("syncApi", "getIMSToken")
                    parameters.append("imsUser", imsUser.rawId!!)
                }
                headers {
                    append(HttpHeaders.Authorization, "Bearer " + gropiusGithubConfigurationProperties.apiSecret)
                }
            }.body()
        return tokenResponse.token
    }

    /**
     * Load the token of from the login service
     * @param imsConfig config for the IMS the user has to belong to
     * @param imsUser user to ask the token for
     * @return GitHub auth token
     */
    suspend fun getTokenForIMSUser(imsConfig: IMSConfig, imsUser: IMSUser?): String {
        val readUser =
            imsUser ?: neoOperations.findById<IMSUser>(imsConfig.readUser) ?: throw SyncNotificator.NotificatedError(
                "SYNC_GITHUB_USER_NOT_FOUND"
            )
        if (readUser.ims().value != imsConfig.ims) {
            throw SyncNotificator.NotificatedError(
                "SYNC_GITHUB_USER_INVALID_IMS"
            )
        }
        return getGithubUserToken(readUser) ?: throw SyncNotificator.NotificatedError(
            "SYNC_GITHUB_USER_NO_TOKEN"
        )
    }

    /**
     * Advertise to the login service that an IMSUser  has been created
     * @param user The user AFTER BEING SAVED TO DB (valid, non-null rawId)
     */
    suspend fun advertiseIMSUser(user: IMSUser) {
        val response: HttpResponse = client.put(gropiusGithubConfigurationProperties.loginServiceBase.toString()) {
            url {
                appendPathSegments("syncApi", "linkIMSUser")
                parameters.append("imsUser", user.rawId!!)
            }
            headers {
                append(HttpHeaders.Authorization, "Bearer " + gropiusGithubConfigurationProperties.apiSecret)
            }
        }
    }
}
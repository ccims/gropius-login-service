package gropius.sync

import gropius.model.architecture.IMS
import gropius.model.user.IMSUser
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.serialization.Serializable
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import org.springframework.data.neo4j.core.ReactiveNeo4jOperations
import org.springframework.data.neo4j.core.findById
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder.json
import org.springframework.stereotype.Component
import java.net.URI
import io.ktor.serialization.kotlinx.json.*
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder

/**
 * Configuration properties for the GitHub API
 *
 * @param loginServiceBase Base url for login service
 * @param apiSecret API Secret for login service
 */
@ConstructorBinding
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
            json()
            json(contentType = ContentType.parse("application/json; charset=utf-8"))
        }
    }

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
    suspend fun getGithubUserToken(imsUser: IMSUser): String? {
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
        return getGithubUserToken(readUserInfo) ?: throw SyncNotificator.NotificatedError(
            "SYNC_GITHUB_USER_NO_TOKEN"
        )
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

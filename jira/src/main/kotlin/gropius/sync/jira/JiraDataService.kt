package gropius.sync.jira

import gropius.model.architecture.IMSProject
import gropius.model.issue.Label
import gropius.model.template.*
import gropius.model.user.IMSUser
import gropius.model.user.User
import gropius.sync.JsonHelper
import gropius.sync.SyncDataService
import gropius.sync.jira.config.IMSConfig
import gropius.sync.jira.config.IMSProjectConfig
import gropius.sync.user.UserMapper
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.serialization.json.*
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.neo4j.core.ReactiveNeo4jOperations
import org.springframework.stereotype.Component
import java.net.URI
import java.time.OffsetDateTime
import java.util.*

/**
 * Context for Jira Operations
 * @param userMapper UserMapper to map Jira Users to Gropius Users
 * @param neoOperations Neo4jOperations to access the database
 */
@Component
class JiraDataService(
    val userMapper: UserMapper,
    @Qualifier("graphglueNeo4jOperations")
    val neoOperations: ReactiveNeo4jOperations, val tokenManager: JiraTokenManager, val helper: JsonHelper
) : SyncDataService {

    /**
     * Logger used to print notifications
     */
    final val logger = LoggerFactory.getLogger(JiraDataService::class.java)

    /**
     * Get the default issue template
     * @return the default issue template
     */
    suspend fun issueTemplate(): IssueTemplate {
        val newTemplate = IssueTemplate("noissue", "", mutableMapOf(), false)
        newTemplate.issueStates() += IssueState("open", "", true)
        newTemplate.issueStates() += IssueState("closed", "", false)
        for (t in newTemplate.issueStates()) t.partOf() += newTemplate
        return neoOperations.findAll(IssueTemplate::class.java).awaitFirstOrNull() ?: neoOperations.save(
            newTemplate
        ).awaitSingle()
    }

    /**
     * Get the default issue type
     * @return the default issue type
     */
    suspend fun issueType(): IssueType {
        val newIssueType = IssueType("type", "", "")
        newIssueType.partOf() += issueTemplate()
        return neoOperations.findAll(IssueType::class.java).awaitFirstOrNull() ?: neoOperations.save(newIssueType)
            .awaitSingle()
    }

    /**
     * Get the default issue state
     * @param isOpen whether the issue state is open or closed
     * @return the default issue state
     */
    suspend fun issueState(isOpen: Boolean): IssueState {
        val newIssueState = IssueState(if (isOpen) "open" else "closed", "", isOpen)
        newIssueState.partOf() += issueTemplate()
        return neoOperations.findAll(IssueState::class.java).filter { it.isOpen == isOpen }.awaitFirstOrNull()
            ?: neoOperations.save(newIssueState).awaitSingle()
    }

    /**
     * Get a IMSUser for a Jira user
     * @param imsProject the project to map the user to
     * @param user the Jira user
     */
    suspend fun mapUser(imsProject: IMSProject, user: JsonElement): User {
        return userMapper.mapUser(
            imsProject,
            user.jsonObject["accountId"]!!.jsonPrimitive.content,
            user.jsonObject["displayName"]!!.jsonPrimitive.content,
            user.jsonObject["emailAddress"]?.jsonPrimitive?.content
        )
    }

    /**
     * Map a label from Jira to Gropius
     * @param imsProject the project to map the label to
     * @param label the label to map
     */
    suspend fun mapLabel(imsProject: IMSProject, label: String): Label {
        val trackable = imsProject.trackable().value
        val labels = trackable.labels().filter { it.name == label }
        if (labels.isEmpty()) {
            val label = Label(OffsetDateTime.now(), OffsetDateTime.now(), label, "Jira Label", "000000")
            label.createdBy().value = userMapper.mapUser(imsProject, "jira-user")
            label.lastModifiedBy().value = label.createdBy().value
            label.trackables() += trackable
            return neoOperations.save(label).awaitSingle()
        } else if (labels.size == 1) {
            return labels.single()
        } else {
            return labels.first()
        }
    }

    val client = HttpClient() {
        expectSuccess = true
        install(Logging)
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            }, contentType = ContentType.parse("application/json; charset=utf-8"))
        }
    }

    final suspend inline fun <reified T> request(
        imsProject: IMSProject,
        users: List<User>,
        requestMethod: HttpMethod,
        body: T? = null,
        crossinline urlBuilder: URLBuilder .(URLBuilder) -> Unit
    ): Pair<IMSUser, HttpResponse> {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        val imsConfig = IMSConfig(helper, imsProject.ims().value, imsProject.ims().value.template().value)
        val userList = users.toMutableList()
        if (imsConfig.readUser != null) {
            val imsUser = neoOperations.findById(imsConfig.readUser, IMSUser::class.java).awaitSingle()
            if (imsUser.ims().value != imsProject.ims().value) {
                TODO("Error handling")
            }
            userList.add(imsUser)
        }
        logger.info("Requesting with users: $userList")
        return tokenManager.executeUntilWorking(imsProject.ims().value, userList) { token ->
            val cloudId = token.cloudIds?.filter { URI(it.url + "/rest/api/2") == URI(imsConfig.rootUrl.toString()) }
                ?.map { it.id }?.firstOrNull()
            println("CLOUDID: $cloudId from ${token.cloudIds}")
            if (cloudId != null) {
                val res = client.request("https://api.atlassian.com/ex/jira/") {
                    method = requestMethod
                    url {
                        appendPathSegments(cloudId)
                        appendPathSegments("/rest/api/2/")
                        urlBuilder(this)
                    }
                    headers {
                        append(
                            HttpHeaders.Authorization, "Bearer ${token.token}"
                        )
                    }
                    if (body != null) {
                        setBody(body)
                    }
                }
                logger.info("Response Code for request with token token is ${res.status} (${res.status == HttpStatusCode.OK}, ${HttpStatusCode.OK})")
                if (res.status == HttpStatusCode.OK) {
                    logger.trace("Response for ${res.request.url} ${res.bodyAsText()}")
                    Optional.of(res)
                } else Optional.empty()
            } else Optional.empty()
        }
    }
}
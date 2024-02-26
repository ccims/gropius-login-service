package gropius.sync.github

import com.apollographql.apollo3.ApolloClient
import com.apollographql.apollo3.api.ApolloResponse
import com.apollographql.apollo3.api.Mutation
import gropius.model.architecture.IMSProject
import gropius.model.issue.Label
import gropius.model.template.*
import gropius.model.user.IMSUser
import gropius.model.user.User
import gropius.sync.JsonHelper
import gropius.sync.SyncDataService
import gropius.sync.TokenManager
import gropius.sync.github.config.IMSConfig
import gropius.sync.github.config.IMSProjectConfig
import gropius.sync.github.generated.fragment.LabelData
import gropius.sync.model.LabelInfo
import gropius.sync.repository.LabelInfoRepository
import gropius.sync.user.UserMapper
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.awaitSingle
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.neo4j.core.ReactiveNeo4jOperations
import org.springframework.data.neo4j.core.findById
import org.springframework.stereotype.Component
import java.net.URI
import java.time.OffsetDateTime
import java.util.*

/**
 * Service to handle data from GitHub
 * @param issuePileService the issue pile service to use
 * @param userMapper the user mapper to use
 * @param neoOperations Reference for the spring instance of ReactiveNeo4jOperations
 * @param labelInfoRepository the label info repository to use
 */
@Component
class GithubDataService(
    val issuePileService: IssuePileService,
    val userMapper: UserMapper,
    @Qualifier("graphglueNeo4jOperations")
    val neoOperations: ReactiveNeo4jOperations,
    val labelInfoRepository: LabelInfoRepository,
    val tokenManager: TokenManager,
    val helper: JsonHelper
) : SyncDataService {
    /**
     * Logger used to print notifications
     */
    final val logger = LoggerFactory.getLogger(GithubDataService::class.java)

    /**
     * Find and ensure the IMSTemplate in the database
     * @return the IssueTemplate
     */
    suspend fun issueTemplate(): IssueTemplate {
        return neoOperations.findAll(IssueTemplate::class.java).awaitFirstOrNull() ?: neoOperations.save(
            IssueTemplate("noissue", "", mutableMapOf(), false)
        ).awaitSingle()
    }

    /**
     * Find and ensure the IMSIssueTemplate in the database
     * @return the IssueType
     */
    suspend fun issueType(): IssueType {
        val newIssueType = IssueType("type", "", "")
        newIssueType.partOf() += issueTemplate()
        return neoOperations.findAll(IssueType::class.java).awaitFirstOrNull() ?: neoOperations.save(newIssueType)
            .awaitSingle()
    }

    /**
     * Find and ensure the IMSIssueTemplate in the database
     * @param isOpen whether the state is open or closed
     * @return the IssueState
     */
    suspend fun issueState(isOpen: Boolean): IssueState {
        val newIssueState = IssueState(if (isOpen) "open" else "closed", "", isOpen)
        newIssueState.partOf() += issueTemplate()
        return neoOperations.findAll(IssueState::class.java).filter { it.isOpen == isOpen }.awaitFirstOrNull()
            ?: neoOperations.save(newIssueState).awaitSingle()
    }

    /**
     * Map a Label from GitHub to Gropius
     * @param imsProject the Gropius IMSProject to use as input
     * @param labelData the label data to map
     * @return the mapped Label
     */
    suspend fun mapLabel(imsProject: IMSProject, labelData: LabelData): Label? {
        val labelInfo = labelInfoRepository.findByImsProjectAndGithubId(imsProject.rawId!!, labelData.id)
        if (labelInfo != null) {
            return neoOperations.findById<Label>(labelInfo.neo4jId)
        }
        var label = Label(
            labelData.createdAt ?: OffsetDateTime.MIN,
            labelData.createdAt ?: OffsetDateTime.MIN,
            labelData.name,
            "GitHub Label",
            labelData.color
        )
        label.createdBy().value = userMapper.mapUser(imsProject, "github-user")
        label.lastModifiedBy().value = label.createdBy().value
        label.trackables() += imsProject.trackable().value
        label = neoOperations.save(label).awaitSingle()
        labelInfoRepository.save(LabelInfo(imsProject.rawId!!, labelData.id, label.rawId!!)).awaitSingle()
        return label
    }

    final suspend inline fun <reified D : Mutation.Data> mutation(
        imsProject: IMSProject, users: List<User>, body: Mutation<D>
    ): Pair<IMSUser, ApolloResponse<D>> {
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
            val apolloClient = ApolloClient.Builder().serverUrl(URI("https://api.github.com/graphql").toString())
                .addHttpHeader("Authorization", "Bearer " + token).build()
            val res = apolloClient.mutation(body).execute()
            logger.info("Response Code for request with token $token is ${res.data} ${res.errors}")
            if (res.errors?.isNotEmpty() != true) Optional.of(res)
            else Optional.empty()
        }
    }
}
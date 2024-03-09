package gropius.sync.jira

import gropius.model.architecture.IMSProject
import gropius.model.issue.Issue
import gropius.model.issue.Label
import gropius.model.issue.timeline.IssueComment
import gropius.model.template.IMSTemplate
import gropius.model.template.IssueState
import gropius.model.user.User
import gropius.sync.*
import gropius.sync.jira.config.IMSConfig
import gropius.sync.jira.config.IMSConfigManager
import gropius.sync.jira.config.IMSProjectConfig
import gropius.sync.jira.model.*
import io.ktor.client.call.*
import io.ktor.http.*
import kotlinx.serialization.json.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import kotlin.io.encoding.ExperimentalEncodingApi

/**
 * Jira main sync class
 * @param jiraDataService the data service for Jira
 * @param helper the json helper
 * @param cursorResourceWalkerDataService the data service for the cursor resource walker
 * @param imsConfigManager the config manager for the IMS
 * @param collectedSyncInfo the collected sync info
 * @param loadBalancedDataFetcher the load balanced data fetcher
 * @param issueDataService the data service for issues
 */
@Component
final class JiraSync(
    val jiraDataService: JiraDataService,
    val helper: JsonHelper,
    val cursorResourceWalkerDataService: CursorResourceWalkerDataService,
    val imsConfigManager: IMSConfigManager,
    collectedSyncInfo: CollectedSyncInfo,
    val loadBalancedDataFetcher: LoadBalancedDataFetcher = LoadBalancedDataFetcher(),
    val issueDataService: IssueDataService
) : AbstractSync(collectedSyncInfo) {

    /**
     * Logger used to print notifications
     */
    private val logger = LoggerFactory.getLogger(JiraSync::class.java)

    override fun syncDataService(): SyncDataService {
        return jiraDataService
    }

    override suspend fun findTemplates(): Set<IMSTemplate> {
        return imsConfigManager.findTemplates()
    }

    override suspend fun isOutgoingEnabled(imsProject: IMSProject): Boolean {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        return imsProjectConfig.enableOutgoing
    }

    override suspend fun isOutgoingLabelsEnabled(imsProject: IMSProject): Boolean {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        return imsProjectConfig.enableOutgoingLabels
    }

    override suspend fun isOutgoingCommentsEnabled(imsProject: IMSProject): Boolean {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        return imsProjectConfig.enableOutgoingComments
    }

    override suspend fun isOutgoingTitleChangedEnabled(imsProject: IMSProject): Boolean {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        return imsProjectConfig.enableOutgoingTitleChanges
    }

    override suspend fun isOutgoingAssignmentsEnabled(imsProject: IMSProject): Boolean {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        return imsProjectConfig.enableOutgoingAssignments
    }

    override suspend fun isOutgoingStatesEnabled(imsProject: IMSProject): Boolean {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        return imsProjectConfig.enableOutgoingState
    }

    override suspend fun fetchData(imsProjects: List<IMSProject>) {
        for (imsProject in imsProjects) {
            val issueList = mutableListOf<String>()
            fetchIssueList(imsProject, issueList)
            fetchIssueContent(issueList, imsProject)
        }
    }

    @OptIn(ExperimentalEncodingApi::class)
    private suspend fun fetchIssueContent(
        issueList: MutableList<String>, imsProject: IMSProject
    ) {
        logger.info("ISSUE LIST $issueList")
        for (issueId in issueList) {
            var startAt = 0
            while (true) {
                val imsProjectConfig = IMSProjectConfig(helper, imsProject)
                val imsConfig = IMSConfig(helper, imsProject.ims().value, imsProject.ims().value.template().value)
                val q = jiraDataService.request<Unit>(imsProject, listOf(), HttpMethod.Get) {
                    appendPathSegments("issue")
                    appendPathSegments(issueId)
                    appendPathSegments("comment")
                    parameters.append("startAt", "$startAt")
                }.second.body<CommentQuery>()
                q.comments.forEach {
                    issueDataService.insertComment(imsProject, issueId, it)
                }
                startAt = q.startAt + q.comments.size
                if (startAt >= q.total) break
            }
        }
    }

    @OptIn(ExperimentalEncodingApi::class)
    private suspend fun fetchIssueList(
        imsProject: IMSProject, issueList: MutableList<String>
    ) {
        var startAt = 0
        while (true) {
            val imsProjectConfig = IMSProjectConfig(helper, imsProject)
            val imsConfig = IMSConfig(helper, imsProject.ims().value, imsProject.ims().value.template().value)
            val q = jiraDataService.request<Unit>(imsProject, listOf(), HttpMethod.Get) {
                appendPathSegments("search")
                parameters.append("jql", "project=${imsProjectConfig.repo}")
                parameters.append("expand", "names,schema,editmeta,changelog")
                parameters.append("startAt", "$startAt")
            }.second.body<ProjectQuery>()
            q.issues(imsProject).forEach {
                issueList.add(it.jiraId)
                issueDataService.insertIssue(imsProject, it)
            }
            startAt = q.startAt + q.issues.size
            if (startAt >= q.total) break
        }
    }

    override suspend fun findUnsyncedIssues(imsProject: IMSProject): List<IncomingIssue> {
        return issueDataService.findByImsProject(imsProject.rawId!!)
    }

    override suspend fun syncComment(
        imsProject: IMSProject, issueId: String, issueComment: IssueComment, users: List<User>
    ): TimelineItemConversionInformation? {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        val imsConfig = IMSConfig(helper, imsProject.ims().value, imsProject.ims().value.template().value)
        if (issueComment.body.isNullOrEmpty()) return null;
        val iid = jiraDataService.request(
            imsProject, users, HttpMethod.Post, JsonObject(mapOf("body" to JsonPrimitive(issueComment.body)))
        ) {
            appendPathSegments("issue")
            appendPathSegments(issueId)
            appendPathSegments("comment")
        }.second.body<JsonObject>()["id"]!!.jsonPrimitive.content
        return JiraTimelineItemConversionInformation(imsProject.rawId!!, iid)
    }

    override suspend fun syncTitleChange(
        imsProject: IMSProject, issueId: String, newTitle: String, users: List<User>
    ): TimelineItemConversionInformation? {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        val imsConfig = IMSConfig(helper, imsProject.ims().value, imsProject.ims().value.template().value)
        jiraDataService.request(
            imsProject, users, HttpMethod.Put, JsonObject(
                mapOf(
                    "fields" to JsonObject(
                        mapOf(
                            "summary" to JsonPrimitive(newTitle)
                        )
                    )
                )
            )
        ) {
            appendPathSegments("issue")
            appendPathSegments(issueId)
        }
        return JiraTimelineItemConversionInformation(
            imsProject.rawId!!, "TODO: Get changelog id to prevent duplicate TimelineItem"
        )
    }

    override suspend fun syncStateChange(
        imsProject: IMSProject, issueId: String, newState: IssueState, users: List<User>
    ): TimelineItemConversionInformation? {
        if (true) {
            //TODO: Jira State Transitions
            return null;
        }
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        val imsConfig = IMSConfig(helper, imsProject.ims().value, imsProject.ims().value.template().value)
        jiraDataService.request(
            imsProject, users, HttpMethod.Put, JsonObject(
                mapOf(
                    "fields" to JsonObject(
                        mapOf(
                            "resolution" to if (newState.isOpen) JsonNull else JsonPrimitive("Done"),
                            "status" to if (newState.isOpen) JsonPrimitive("To Do") else JsonPrimitive("Done")
                        )
                    )
                )
            )
        ) {
            appendPathSegments("issue")
            appendPathSegments(issueId)
        }
        return JiraTimelineItemConversionInformation(
            imsProject.rawId!!, "TODO: Get changelog id to prevent duplicate TimelineItem"
        )
    }

    override suspend fun syncAddedLabel(
        imsProject: IMSProject, issueId: String, label: Label, users: List<User>
    ): TimelineItemConversionInformation? {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        val imsConfig = IMSConfig(helper, imsProject.ims().value, imsProject.ims().value.template().value)
        jiraDataService.request(
            imsProject, users, HttpMethod.Put, JsonObject(
                mapOf(
                    "update" to JsonObject(
                        mapOf(
                            "labels" to JsonArray(
                                listOf(
                                    JsonObject(
                                        mapOf(
                                            "add" to JsonPrimitive(
                                                jirafyLabelName(label.name)
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        ) {
            appendPathSegments("issue")
            appendPathSegments(issueId)
        }
        return JiraTimelineItemConversionInformation(
            imsProject.rawId!!, "TODO: Get changelog id to prevent duplicate TimelineItem"
        )
    }

    /**
     * Scape a Gropius Label name for Jira
     */
    fun jirafyLabelName(gropiusName: String): String {
        return gropiusName.replace("[^A-Za-z0-9]+".toRegex(), "_").replace("^_*".toRegex(), "")
            .replace("_*$".toRegex(), "")
    }

    override suspend fun syncRemovedLabel(
        imsProject: IMSProject, issueId: String, label: Label, users: List<User>
    ): TimelineItemConversionInformation? {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        val imsConfig = IMSConfig(helper, imsProject.ims().value, imsProject.ims().value.template().value)
        jiraDataService.request(
            imsProject, users, HttpMethod.Put, JsonObject(
                mapOf(
                    "update" to JsonObject(
                        mapOf(
                            "labels" to JsonArray(
                                listOf(
                                    JsonObject(
                                        mapOf(
                                            "remove" to JsonPrimitive(
                                                jirafyLabelName(label.name)
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        ) {
            appendPathSegments("issue")
            appendPathSegments(issueId)
        }
        return JiraTimelineItemConversionInformation(
            imsProject.rawId!!, "TODO: Get changelog id to prevent duplicate TimelineItem"
        )
    }

    override suspend fun createOutgoingIssue(imsProject: IMSProject, issue: Issue): IssueConversionInformation? {
        val imsProjectConfig = IMSProjectConfig(helper, imsProject)
        val imsConfig = IMSConfig(helper, imsProject.ims().value, imsProject.ims().value.template().value)
        val iid = jiraDataService.request(
            imsProject,
            listOf(issue.createdBy().value, issue.lastModifiedBy().value) + issue.timelineItems()
                .map { it.createdBy().value },
            HttpMethod.Post,
            IssueQueryRequest(
                IssueQueryRequestFields(
                    issue.title,
                    issue.bodyBody,
                    IssueTypeRequest("Bug"),
                    ProjectRequest(imsProjectConfig.repo),
                    listOf()
                )
            )
        ) {
            appendPathSegments("issue")
        }.second.body<JsonObject>()["id"]!!.jsonPrimitive.content
        return IssueConversionInformation(imsProject.rawId!!, iid, issue.rawId!!)
    }
}

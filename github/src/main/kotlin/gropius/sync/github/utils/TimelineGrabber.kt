package gropius.sync.github.utils

import com.apollographql.apollo3.ApolloClient
import gropius.sync.github.config.IMSProjectConfig
import gropius.sync.github.generated.TimelineReadQuery
import gropius.sync.github.generated.TimelineReadQuery.Data.Companion.metaData
import gropius.sync.github.generated.TimelineReadQuery.Data.Node.Companion.asIssue
import gropius.sync.github.generated.fragment.TimelineItemData
import gropius.sync.github.generated.fragment.TimelineItemData.Companion.asNode
import gropius.sync.github.model.IssueInfo
import gropius.sync.github.model.TimelineItemDataCache
import gropius.sync.github.repository.IssueInfoRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.*
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import java.time.OffsetDateTime

/**
 * Implementation of Grabber to retrieve timeline items and cache them in the database
 * @param apolloClient Apollo Client to use
 */
class TimelineGrabber(
    /**
     * Reference for the spring instance of IssueInfoRepository
     */
    private val issueInfoRepository: IssueInfoRepository,
    /**
     * Reference for the spring instance of ReactiveMongoOperations
     */
    private val mongoOperations: ReactiveMongoOperations,
    /**
     * GitHub id of the issue
     */
    private val id: String, private val apolloClient: ApolloClient, private val imsProjectConfig: IMSProjectConfig
) : Grabber<TimelineItemData>() {

    /**
     * The response of a single step of timeline grabbing
     */
    class TimelineStepResponse(
        /**
         * The raw GitHub response
         */
        val content: TimelineReadQuery.Data
    ) : StepResponse<TimelineItemData> {
        override val metaData get() = content.metaData()!!
        override val nodes
            get() = content.node!!.asIssue()!!.timelineItems.nodes!!.filterNotNull()
        override val totalCount get() = content.node!!.asIssue()!!.timelineItems.totalCount
        override val pageInfoData get() = content.node!!.asIssue()!!.timelineItems.pageInfo
    }

    override suspend fun writeTimestamp(time: OffsetDateTime) {
        mongoOperations.update<IssueInfo>().matching(
            Query.query(
                Criteria.where(TimelineItemDataCache::url.name).`is`(imsProjectConfig.url)
                    .and(IssueInfo::githubId.name).`is`(id)
            )
        ).apply(
            Update().max(IssueInfo::lastAccess.name, time)
        ).firstAndAwait()
    }

    override suspend fun readTimestamp(): OffsetDateTime? {
        return issueInfoRepository.findByUrlAndGithubId(imsProjectConfig.url, id)?.lastAccess
    }

    override suspend fun addToCache(node: TimelineItemData): ObjectId {
        return mongoOperations.update<TimelineItemDataCache>().matching(
            Query.query(
                Criteria.where(TimelineItemDataCache::url.name).`is`(imsProjectConfig.url)
                    .and(TimelineItemDataCache::githubId.name).`is`(node.asNode()!!.id)
            )
        ).apply(Update.update(TimelineItemDataCache::data.name, node).set(TimelineItemDataCache::issue.name, id))
            .withOptions(FindAndModifyOptions.options().upsert(true).returnNew(true)).findAndModify().awaitSingle().id!!
    }

    override suspend fun iterateCache(): Flow<TimelineItemData> {
        return mongoOperations.query<TimelineItemDataCache>().matching(
            Query.query(
                Criteria.where(TimelineItemDataCache::url.name).`is`(imsProjectConfig.url)
                    .and(TimelineItemDataCache::issue.name).`is`(id)
            ).addCriteria(Criteria.where(TimelineItemDataCache::attempts.name).not().gte(7))
        ).all().asFlow().map { it.data }
    }

    override suspend fun removeFromCache(node: String) {
        mongoOperations.remove<TimelineItemDataCache>(
            Query.query(
                Criteria.where(TimelineItemDataCache::url.name).`is`(imsProjectConfig.url)
                    .and(TimelineItemDataCache::issue.name).`is`(id)
            ).addCriteria(Criteria.where(TimelineItemDataCache::githubId.name).`is`(node))
        ).awaitSingle()
    }

    override suspend fun increaseFailedCache(node: String) {
        mongoOperations.update<TimelineItemDataCache>().matching(
            Query.query(
                Criteria.where(TimelineItemDataCache::url.name).`is`(imsProjectConfig.url).and("data.id").`is`(node)
            )
        ).apply(Update().inc(TimelineItemDataCache::attempts.name, 1)).firstAndAwait()
    }

    override fun nodeId(node: TimelineItemData): String {
        return node.asNode()?.id!!
    }

    override suspend fun grabStep(
        since: OffsetDateTime?, cursor: String?, count: Int
    ): StepResponse<TimelineItemData>? {
        val query = TimelineReadQuery(
            issue = id, since = since, cursor = cursor, issueCount = count
        )
        val response = apolloClient.query(
            query
        ).execute()
        return if (response.data?.node?.asIssue()?.timelineItems?.nodes != null) {
            TimelineStepResponse(response.data!!)
        } else {
            null
        }
    }
}
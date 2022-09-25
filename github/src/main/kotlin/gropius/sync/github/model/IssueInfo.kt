package gropius.sync.github.model

import gropius.model.issue.Issue
import gropius.sync.github.generated.fragment.IssueData
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.neo4j.core.ReactiveNeo4jOperations
import org.springframework.data.neo4j.core.findById
import java.net.URI
import java.time.OffsetDateTime

/**
 * Mapping of a single issue from neo4j to GitHub
 * @param url API URL of IMS of the repo
 * @param githubId ID on GitHub
 * @param neo4jId ID in gropius database
 * @param dirty True if changed after last access and has to be queried
 * @param lastAccess Time of the last accessed timeline item
 * @param lastOutgoingSync lastUpdatedAt when the last outgoing sync was successful
 */
@Document
data class IssueInfo(
    @Indexed
    var githubId: String,
    @Indexed
    val url: URI,
    @Indexed
    var neo4jId: String,
    val dirty: Boolean,
    var lastAccess: OffsetDateTime?,
    val issueData: IssueData,
    var lastOutgoingSync: OffsetDateTime?
) {
    /**
     * MongoDB ID
     */
    @Id
    var id: ObjectId? = null

    /**
     * Turn the IssueInfo into a gropius Issue
     * @param neoOperations Reference for the spring instance of ReactiveNeo4jOperations
     * @return the freshly loaded Issue object
     */
    suspend fun load(neoOperations: ReactiveNeo4jOperations): Issue {
        return neoOperations.findById(neo4jId)!!
    }
}

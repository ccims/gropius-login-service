package gropius.sync.github.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.net.URI
import java.time.OffsetDateTime

/**
 * Mapping of a single timeline event from neo4j to GitHub
 * @param url API URL of IMS of the repo
 * @param githubId ID on GitHub
 * @param neo4jId ID in gropius database
 * @param lastModifiedAt Time of the last interaction with this timeline item
 * @param type GitHub __typename of this event
 */
@Document
data class TimelineEventInfo(
    @Indexed
    var githubId: String,
    @Indexed
    var neo4jId: String?,
    var lastModifiedAt: OffsetDateTime,
    val type: String?,
    @Indexed
    val url: URI
) {
    /**
     * MongoDB ID
     */
    @Id
    var id: ObjectId? = null
}

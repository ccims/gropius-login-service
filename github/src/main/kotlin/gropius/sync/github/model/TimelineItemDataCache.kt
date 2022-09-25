package gropius.sync.github.model

import gropius.sync.github.generated.fragment.TimelineItemData
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Cache for unprocessed timeline items
 * @param url API URL of IMS of the repo
 * @param githubId ID on GitHub
 * @param issue GitHub ID of the associated issue
 * @param data Raw Github API data
 * @param attempts Number of attempts to sync into gropius database
 */
@Document
data class TimelineItemDataCache(
    @Indexed
    val url: String,
    @Indexed
    var githubId: String,
    @Indexed
    val issue: String, val data: TimelineItemData, var attempts: Int?
) {
    /**
     * MongoDB ID
     */
    @Id
    var id: ObjectId? = null
}

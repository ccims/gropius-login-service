package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import gropius.model.user.permission.NodePermission
import io.github.graphglue.model.Authorization
import io.github.graphglue.model.DomainNode
import java.time.OffsetDateTime

/**
 * TimelineItem which grants READ if READ is granted on the [issue]
 */
@DomainNode
@GraphQLIgnore
@Authorization(NodePermission.READ, allowFromRelated = ["issue"])
abstract class PublicTimelineItem(
    createdAt: OffsetDateTime, lastModifiedAt: OffsetDateTime
) : TimelineItem(createdAt, lastModifiedAt)
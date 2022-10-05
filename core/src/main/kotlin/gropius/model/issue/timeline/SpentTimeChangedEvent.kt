package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import java.time.Duration
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription("Event representing that the spent time of an Issue changed.")
class SpentTimeChangedEvent(
    createdAt: OffsetDateTime,
    lastModifiedAt: OffsetDateTime,
    @property:GraphQLDescription("The old spent time.")
    @FilterProperty
    val oldSpentTime: Duration?,
    @property:GraphQLDescription("The mew spent time.")
    @FilterProperty
    val newSpentTime: Duration?
) : TimelineItem(createdAt, lastModifiedAt)
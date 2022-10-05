package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription("Event representing that the start date of an Issue changed.")
class StartDateChangedEvent(
    createdAt: OffsetDateTime,
    lastModifiedAt: OffsetDateTime,
    @property:GraphQLDescription("The old start date.")
    @FilterProperty
    val oldStartDate: OffsetDateTime?,
    @property:GraphQLDescription("The new start date.")
    @FilterProperty
    val newStartDate: OffsetDateTime?
) : TimelineItem(createdAt, lastModifiedAt)
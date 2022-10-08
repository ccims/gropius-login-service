package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription("Event representing that the title of an Issue changed.")
class TitleChangedEvent(
    createdAt: OffsetDateTime,
    lastModifiedAt: OffsetDateTime,
    @property:GraphQLDescription("The old title.")
    @FilterProperty
    val oldTitle: String,
    @property:GraphQLDescription("The new title.")
    @FilterProperty
    val newTitle: String
) : PublicTimelineItem(createdAt, lastModifiedAt)
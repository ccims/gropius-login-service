package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import io.github.graphglue.model.DomainNode
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription(
    """Main Body of an Issue.
    Each Issue has exactly one Body. Keeps track when it was last edited and by who, but does not keep track of the change history.
    READ is granted if READ is granted on `issue`.
    """
)
class Body(
    createdAt: OffsetDateTime, lastModifiedAt: OffsetDateTime, bodyLastEditedAt: OffsetDateTime
) : Comment(createdAt, lastModifiedAt, bodyLastEditedAt)
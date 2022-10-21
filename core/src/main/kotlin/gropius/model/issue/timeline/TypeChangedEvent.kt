package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.template.IssueType
import io.github.graphglue.model.Direction
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import io.github.graphglue.model.NodeRelationship
import org.springframework.data.annotation.Transient
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription(
    """Event representing that the type of an Issue changed.
    READ is granted if READ is granted on `issue`.
    """
)
class TypeChangedEvent(
    createdAt: OffsetDateTime, lastModifiedAt: OffsetDateTime
) : AbstractTypeChangedEvent<IssueType>(createdAt, lastModifiedAt)
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
@GraphQLDescription("Event representing that the type of an Issue changed.")
class TypeChangedEvent(
    createdAt: OffsetDateTime, lastModifiedAt: OffsetDateTime,
) : TimelineItem(createdAt, lastModifiedAt) {

    companion object {
        const val OLD_TYPE = "OLD_TYPE"
        const val NEW_TYPE = "NEW_TYPE"
    }

    @NodeRelationship(OLD_TYPE, Direction.OUTGOING)
    @GraphQLDescription("The old type.")
    @FilterProperty
    @delegate:Transient
    val oldType by NodeProperty<IssueType>()

    @NodeRelationship(NEW_TYPE, Direction.OUTGOING)
    @GraphQLDescription("The new type.")
    @FilterProperty
    @delegate:Transient
    val newType by NodeProperty<IssueType>()
}
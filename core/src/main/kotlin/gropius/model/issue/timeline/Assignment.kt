package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.template.AssignmentType
import gropius.model.user.User
import io.github.graphglue.model.Direction
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import io.github.graphglue.model.NodeRelationship
import org.springframework.data.annotation.Transient
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription(
    """Event representing that a User is assigned to an Issue.
    An Assignment is only active if it is still in `assignments` on Issue.
    """
)
class Assignment(createdAt: OffsetDateTime, lastModifiedAt: OffsetDateTime) : PublicTimelineItem(createdAt, lastModifiedAt) {

    companion object {
        const val TYPE = "TYPE"
        const val USER = "USER"
    }

    @NodeRelationship(TYPE, Direction.OUTGOING)
    @GraphQLDescription("The type of Assignment, e.g. REVIEWER. Allowed types are defined by the IssueTemplate.")
    @FilterProperty
    @delegate:Transient
    val type by NodeProperty<AssignmentType?>()

    @NodeRelationship(USER, Direction.OUTGOING)
    @GraphQLDescription("The User assigned to the Issue.")
    @FilterProperty
    @delegate:Transient
    val user by NodeProperty<User>()

}
package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.template.IssueRelationType
import io.github.graphglue.model.Direction
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import io.github.graphglue.model.NodeRelationship
import org.springframework.data.annotation.Transient
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription("Event representing that the type of an IssueRelation changed.")
abstract class RelationTypeChangedEvent(
    createdAt: OffsetDateTime, lastModifiedAt: OffsetDateTime,
) : AbstractTypeChangedEvent<IssueRelationType>(createdAt, lastModifiedAt) {

    companion object {
        const val ISSUE_RELATION = "ISSUE_RELATION"
    }

    @NodeRelationship(ISSUE_RELATION, Direction.OUTGOING)
    @GraphQLDescription("The IssueRelation of which the type was changed")
    @FilterProperty
    @delegate:Transient
    val issueRelation by NodeProperty<IssueRelation>()

}
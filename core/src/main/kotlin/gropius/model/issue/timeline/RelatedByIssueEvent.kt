package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import io.github.graphglue.model.*
import org.springframework.data.annotation.Transient
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription(
    """Event representing that the Issue was used in an IssueRelation as related issue.
    The IssueRelation may not be active any more.
    """
)
class RelatedByIssueEvent(
    createdAt: OffsetDateTime,
    lastModifiedAt: OffsetDateTime,
) : PublicTimelineItem(createdAt, lastModifiedAt) {

    companion object {
        const val RELATION = "RELATION"
    }

    @NodeRelationship(RELATION, Direction.OUTGOING)
    @GraphQLDescription("The IssueRelation the Issue is related at.")
    @GraphQLNullable
    @FilterProperty
    @delegate:Transient
    val relation by NodeProperty<IssueRelation>()

}
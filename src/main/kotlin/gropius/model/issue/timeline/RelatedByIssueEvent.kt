package gropius.model.issue.timeline

import io.github.graphglue.model.Direction
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import io.github.graphglue.model.NodeRelationship
import org.springframework.data.annotation.Transient
import java.time.OffsetDateTime

@DomainNode
class RelatedByIssueEvent(
    createdAt: OffsetDateTime,
    lastModifiedAt: OffsetDateTime,
) : TimelineItem(createdAt, lastModifiedAt) {

    companion object {
        const val RELATION = "RELATION"
    }

    @NodeRelationship(RELATION, Direction.OUTGOING)
    @FilterProperty
    @delegate:Transient
    var relation by NodeProperty<IssueRelation>()

}
package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.common.AuditedNode
import gropius.model.issue.Issue
import io.github.graphglue.model.*
import org.springframework.data.annotation.Transient
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription("Supertype of all timeline items. Always part of an Issue.")
abstract class TimelineItem(
    createdAt: OffsetDateTime, lastModifiedAt: OffsetDateTime
) : AuditedNode(createdAt, lastModifiedAt) {

    @NodeRelationship(Issue.TIMELINE, Direction.INCOMING)
    @GraphQLDescription("The Issue this TimelineItem is part of.")
    @FilterProperty
    @delegate:Transient
    val issue by NodeProperty<Issue>()

    @NodeRelationship(ParentTimelineItem.CHILD_ITEMS, Direction.INCOMING)
    @GraphQLDescription("If existing, the parent TimelineItem")
    @FilterProperty
    @delegate:Transient
    val parentItem by NodeProperty<ParentTimelineItem?>()

}
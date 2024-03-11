package gropius.model.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import gropius.model.architecture.Component
import gropius.model.common.BaseNode
import gropius.model.issue.timeline.IssueRelation
import gropius.model.user.permission.NodePermission
import io.github.graphglue.model.*

@DomainNode
@GraphQLDescription(
    """An aggregated IssueRelation.
    IssueRelations are aggregated by both start and end Issue.
    """
)
class MetaAggregatedIssueRelation(var count: Int) : BaseNode() {

    companion object {
        const val META_ISSUE_RELATION = "META_ISSUE_RELATION"
    }

    @NodeRelationship(Component.OUTGOING_META_AGGREGATED_ISSUE_RELATION, Direction.INCOMING)
    val start by NodeProperty<Component>()

    @NodeRelationship(Component.INCOMING_META_AGGREGATED_ISSUE_RELATION, Direction.INCOMING)
    val end by NodeProperty<Component>()

    @NodeRelationship(META_ISSUE_RELATION, Direction.OUTGOING)
    val issueRelations by NodeSetProperty<IssueRelation>()

}
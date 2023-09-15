package gropius.model.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.user.permission.NodePermission
import io.github.graphglue.model.*

@DomainNode
@GraphQLDescription(
    """An aggregated IssueRelation.
    IssueRelations are aggregated by both start and end Issue.
    """
)
@Authorization(NodePermission.READ, allowFromRelated = ["start"])
class AggregatedIssueRelation(var count: Int) : Node() {

    @NodeRelationship(AggregatedIssue.OUTGOING_RELATION, Direction.INCOMING)
    @GraphQLDescription("The start of this AggregatedIssueRelation.")
    @FilterProperty
    val start by NodeProperty<AggregatedIssue>()

    @NodeRelationship(AggregatedIssue.INCOMING_RELATION, Direction.INCOMING)
    @GraphQLDescription("The end of this AggregatedIssueRelation.")
    @FilterProperty
    val end by NodeProperty<AggregatedIssue>()

}
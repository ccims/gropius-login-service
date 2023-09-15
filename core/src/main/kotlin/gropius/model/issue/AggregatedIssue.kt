package gropius.model.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.architecture.RelationPartner
import gropius.model.template.IssueType
import gropius.model.user.permission.NodePermission
import io.github.graphglue.model.*

@DomainNode
@GraphQLDescription(
    """An aggregated Issue on a RelationPartner.
    READ is granted if READ is granted on `relationPartner`.
    An Issue is aggregated on a ComponentVersion if
    - it affects the ComponentVersion
    - it affects the associated Component
    - it is on the Component, and does not affect anything
    An Issue is aggregated on a Interface if
    - it affects the associated InterfaceSpecificationVersion
    - it affects the associated InterfaceSpecification
    - it affects any InterfacePart of the associated InterfaceSpecificationVersion
    """
)
@Authorization(NodePermission.READ, allowFromRelated = ["relationPartner"])
class AggregatedIssue(
    @FilterProperty
    @OrderProperty
    @property:GraphQLDescription("The amount of Issues of this type on this location.")
    var count: Int,
    @FilterProperty
    @property:GraphQLDescription("If aggregated issues are open or closed.")
    val isOpen: Boolean
) : Node() {

    companion object {
        const val TYPE = "TYPE"
        const val INCOMING_RELATION = "INCOMING_RELATION"
        const val OUTGOING_RELATION = "OUTGOING_RELATION"
        const val ISSUE = "ISSUE"
    }

    @NodeRelationship(TYPE, Direction.OUTGOING)
    @GraphQLDescription("The IssueType of this AggregatedIssue.")
    @FilterProperty
    val type by NodeProperty<IssueType>()

    @NodeRelationship(RelationPartner.AGGREGATED_ISSUE, Direction.INCOMING)
    @GraphQLDescription("The RelationPartner this AggregatedIssue is on.")
    @FilterProperty
    val relationPartner by NodeProperty<RelationPartner>()

    @NodeRelationship(INCOMING_RELATION, Direction.OUTGOING)
    @GraphQLDescription("IssueRelations from this aggregated issue to other aggregated issues.")
    @FilterProperty
    val incomingRelations by NodeSetProperty<AggregatedIssueRelation>()

    @NodeRelationship(OUTGOING_RELATION, Direction.OUTGOING)
    @GraphQLDescription("IssueRelations from other aggregated issues to this aggregated issue.")
    @FilterProperty
    val outgoingRelations by NodeSetProperty<AggregatedIssueRelation>()

    @NodeRelationship(ISSUE, Direction.OUTGOING)
    @GraphQLDescription("The Issues aggregated by this AggregatedIssue.")
    @FilterProperty
    val issues by NodeSetProperty<Issue>()

}
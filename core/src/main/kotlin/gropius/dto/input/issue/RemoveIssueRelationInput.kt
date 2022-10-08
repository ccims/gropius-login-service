package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the removeIssueRelation mutations")
class RemoveIssueRelationInput(
    @GraphQLDescription("The id of the IssueRelation to remove")
    val issueRelation: ID
) : Input()
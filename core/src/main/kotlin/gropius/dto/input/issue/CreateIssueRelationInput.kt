package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the createIssueRelation mutation")
class CreateIssueRelationInput(
    @GraphQLDescription("The id of the Issue from which the IssueRelation starts")
    val issue: ID,
    @GraphQLDescription("The id of the Issue where the IssueRelation ends")
    val relatedIssue: ID,
    @GraphQLDescription("The optional type of the IssueRelation, must be defined by the Template of the Issue")
    val issueRelationType: ID?
) : Input()
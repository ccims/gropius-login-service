package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.CreateExtensibleNodeInput

@GraphQLDescription("Input for the createIssueRelation mutation")
class CreateIssueRelationInput(
    @GraphQLDescription("The id of the Issue to which the User should be assigned")
    val issue: ID,
    @GraphQLDescription("The id of the User to assign to the Issue")
    val user: ID,
    @GraphQLDescription("The optional type of the IssueRelation, must be defined by the Template of the Issue")
    val issueRelationType: ID?
) : CreateExtensibleNodeInput()
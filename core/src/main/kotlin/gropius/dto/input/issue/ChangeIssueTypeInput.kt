package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the changeIssueType mutation")
class ChangeIssueTypeInput(
    @GraphQLDescription("The id of the Issue of which the type is updated")
    val issue: ID,
    @GraphQLDescription("The id of the new type, must be an IssueType of the used IssueTemplate")
    val type: ID
) : Input()
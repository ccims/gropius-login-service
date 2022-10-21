package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the changeIssueState mutation")
class ChangeIssueStateInput(
    @GraphQLDescription("The id of the Issue of which the state is updated")
    val issue: ID,
    @GraphQLDescription("The id of the new state, must be an IssueState of the used IssueTemplate")
    val state: ID
) : Input()
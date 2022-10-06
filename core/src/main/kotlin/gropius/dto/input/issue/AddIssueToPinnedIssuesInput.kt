package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the addIssueToPinnedIssues mutation")
class AddIssueToPinnedIssuesInput(
    @GraphQLDescription("The id of the Trackable where the Issue should be pinned")
    val trackable: ID,
    @GraphQLDescription("The id of the Issue to pin")
    val issue: ID
) : Input()
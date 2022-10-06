package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the removeIssueFromPinnedIssues mutation")
class RemoveIssueFromPinnedIssuesInput(
    @GraphQLDescription("The id of the Trackable where the Issue should be unpinned")
    val trackable: ID,
    @GraphQLDescription("The id of the Issue to unpin")
    val issue: ID
) : Input()
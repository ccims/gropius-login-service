package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the removeIssueFromTrackable mutation")
class RemoveIssueFromTrackableInput(
    @GraphQLDescription("The id of the Trackable where to remove the Issue")
    val trackable: ID,
    @GraphQLDescription("The id of the Issue to remove from the Trackable")
    val issue: ID
) : Input()
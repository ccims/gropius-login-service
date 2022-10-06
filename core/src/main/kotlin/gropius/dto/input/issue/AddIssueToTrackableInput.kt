package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the addIssueToTrackable mutation")
class AddIssueToTrackableInput(
    @GraphQLDescription("The id of the Trackable where to add the Issue")
    val trackable: ID,
    @GraphQLDescription("The id of the Issue to add to the Trackable")
    val issue: ID
) : Input()
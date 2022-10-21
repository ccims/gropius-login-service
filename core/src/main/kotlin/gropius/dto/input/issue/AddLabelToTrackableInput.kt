package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the addLabelToTrackable mutation")
class AddLabelToTrackableInput(
    @GraphQLDescription("The id of the Label to add")
    val label: ID,
    @GraphQLDescription("The id of the Trackable where to add the Label")
    val trackable: ID
) : Input()
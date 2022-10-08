package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the changeAssignmentType mutation")
class ChangeAssignmentTypeInput(
    @GraphQLDescription("The id of the Assignment of which the type is updated")
    val assignment: ID,
    @GraphQLDescription("The id of the new type, must be defined by the template of the Issue")
    val type: ID
) : Input()
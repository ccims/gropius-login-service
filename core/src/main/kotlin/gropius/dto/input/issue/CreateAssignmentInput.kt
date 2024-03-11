package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the createAssignment mutation")
class CreateAssignmentInput(
    @GraphQLDescription("The id of the Issue to which the User should be assigned")
    val issue: ID,
    @GraphQLDescription("The id of the User to assign to the Issue")
    val user: ID,
    @GraphQLDescription("The optional type of the Assignment, must be defined by the Template of the Issue")
    val assignmentType: ID?
) : Input()
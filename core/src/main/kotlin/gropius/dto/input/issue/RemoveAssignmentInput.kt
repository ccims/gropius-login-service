package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID

@GraphQLDescription("Input for the removeAssignment mutations")
class RemoveAssignmentInput(
    @GraphQLDescription("The id of the Assignment to remove")
    val assignment: ID
)
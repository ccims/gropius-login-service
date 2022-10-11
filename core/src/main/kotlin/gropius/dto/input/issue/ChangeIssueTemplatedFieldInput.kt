package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLType
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.JSONFieldInput

@GraphQLDescription("Input for the changeIssueTemplatedField mutations")
class ChangeIssueTemplatedFieldInput(
    @GraphQLDescription("The name of the templated field to update")
    name: String,
    @GraphQLDescription("The new value of the templated field")
    @GraphQLType("JSON")
    value: Any?,
    @GraphQLDescription("The id of the Issue of which to change a templated field")
    val issue: ID
) : JSONFieldInput(name, value)
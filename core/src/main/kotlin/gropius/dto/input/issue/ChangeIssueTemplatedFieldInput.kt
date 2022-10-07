package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.JSONFieldInput

@GraphQLDescription("Input for the changeIssueTemplatedField mutations")
class ChangeIssueTemplatedFieldInput(
    name: String,
    value: Any?,
    @GraphQLDescription("The id of the Issue of which to change a templated field")
    val issue: ID
) : JSONFieldInput(name, value)
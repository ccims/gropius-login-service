package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLType
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.common.UpdateNamedNodeInput

@GraphQLDescription("Input for the updateLabel mutation")
class UpdateLabelInput(
    @GraphQLDescription("The new color of the Label")
    @GraphQLType("Color")
    val color: OptionalInput<String>
) : UpdateNamedNodeInput()
package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.UpdateNodeInput
import gropius.dto.input.template.UpdateTemplatedNodeInput

@GraphQLDescription("Input for the updateInterfaceDefinition mutation")
class UpdateInterfaceDefinitionInput(
    @GraphQLDescription("Values for templatedFields to update")
    override val templatedFields: OptionalInput<List<JSONFieldInput>>
) : UpdateNodeInput(), UpdateTemplatedNodeInput
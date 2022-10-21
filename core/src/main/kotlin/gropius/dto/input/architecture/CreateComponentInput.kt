package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.ifPresent
import gropius.dto.input.template.CreateTemplatedNodeInput

@GraphQLDescription("Input for the createComponent mutation")
class CreateComponentInput(
    @GraphQLDescription("Initial values for all templatedFields")
    override val templatedFields: List<JSONFieldInput>,
    @GraphQLDescription("The template of the created Component")
    val template: ID,
    @GraphQLDescription("Initial InterfaceSpecifications")
    val interfaceSpecifications: OptionalInput<List<InterfaceSpecificationInput>>,
    @GraphQLDescription("Initial versions of the Component")
    val versions: OptionalInput<List<ComponentVersionInput>>
) : CreateTrackableInput(), CreateTemplatedNodeInput {

    override fun validate() {
        super.validate()
        templatedFields.validateAndEnsureNoDuplicates()
        interfaceSpecifications.ifPresent {
            it.forEach(Input::validate)
        }
        versions.ifPresent {
            it.forEach(Input::validate)
        }
    }
}
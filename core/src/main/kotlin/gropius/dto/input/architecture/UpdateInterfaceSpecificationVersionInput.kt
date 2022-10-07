package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.UpdateNamedNodeInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.ensuredisjoint
import gropius.dto.input.ifPresent
import gropius.dto.input.template.UpdateTemplatedNodeInput

@GraphQLDescription("Input for the updateInterfaceSpecificationVersion mutation")
class UpdateInterfaceSpecificationVersionInput(
    @GraphQLDescription("Values for templatedFields to update")
    override val templatedFields: OptionalInput<List<JSONFieldInput>>,
    @GraphQLDescription("Ids of InterfaceParts defined by the associated InterfaceSpecification to add to `activeParts`")
    val addedActiveParts: OptionalInput<List<ID>>,
    @GraphQLDescription("Ids of InterfaceParts defined by the associated InterfaceSpecification to remove from `activeParts`")
    val removedActiveParts: OptionalInput<List<ID>>,
    @GraphQLDescription("New version of the InterfaceSpecificationVersion")
    val version: OptionalInput<String>
) : UpdateNamedNodeInput(), UpdateTemplatedNodeInput {

    override fun validate() {
        super.validate()
        templatedFields.ifPresent {
            it.validateAndEnsureNoDuplicates()
        }
        ::addedActiveParts ensuredisjoint ::removedActiveParts
    }
}
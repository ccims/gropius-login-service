package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.UpdateExtensibleNodeInput
import gropius.dto.input.common.ensureNoDuplicates
import gropius.dto.input.ifPresent
import gropius.dto.input.template.UpdateTemplatedNodeInput
import java.net.URI

@GraphQLDescription("Input for the updateArtefact mutation")
class UpdateArtefactInput(
    @GraphQLDescription("Values for templatedFields to update")
    override val templatedFields: OptionalInput<List<JSONFieldInput>>,
    @GraphQLDescription(
        """If provided, the id of the new template for the Artefact
        Use `templatedFields` to update fields so that they conform with the new specifications.
        No longer needed fields are automatically removed.
        """
    )
    val template: OptionalInput<ID>,
    @GraphQLDescription("The new file of the Artefact")
    val file: OptionalInput<URI>,
    @GraphQLDescription("The new value of the from field of the Artefact")
    val from: OptionalInput<Int?>,
    @GraphQLDescription("The new value of the to field of the Artefact")
    val to: OptionalInput<Int?>,
    @GraphQLDescription("New version of the Artefact")
    val version: OptionalInput<String?>
) : UpdateExtensibleNodeInput(), UpdateTemplatedNodeInput {

    override fun validate() {
        super.validate()
        templatedFields.ifPresent {
            it.ensureNoDuplicates()
        }
    }

}
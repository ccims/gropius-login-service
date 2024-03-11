package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.template.CreateTemplatedNodeInput
import java.net.URI

@GraphQLDescription("Input for the createArtefact mutation")
class CreateArtefactInput(
    @GraphQLDescription("Initial values for all templatedFields")
    override val templatedFields: List<JSONFieldInput>,
    @GraphQLDescription("The template of the created Artefact")
    val template: ID,
    @GraphQLDescription("The initial file of the Artefact")
    val file: URI,
    @GraphQLDescription("The initial value of the from field of the Artefact")
    val from: Int?,
    @GraphQLDescription("The initial value of the to field of the Artefact")
    val to: Int?,
    @GraphQLDescription("Initial version of the Artefact")
    val version: String?,
    @GraphQLDescription("ID of the Trackable the created Artefact is part of")
    val trackable: ID
) : Input(), CreateTemplatedNodeInput {

    override fun validate() {
        super.validate()
        templatedFields.validateAndEnsureNoDuplicates()
    }

}
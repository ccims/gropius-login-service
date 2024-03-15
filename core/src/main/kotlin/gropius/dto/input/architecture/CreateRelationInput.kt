package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.template.CreateTemplatedNodeInput

@GraphQLDescription("Input for the createRelation mutation")
class CreateRelationInput(
    @GraphQLDescription("The start RelationPartner of the Relation")
    val start: ID,
    @GraphQLDescription("The end RelationPartner of the Relation")
    val end: ID,
    @GraphQLDescription("If `start` is an Interface, the parts of the Interface the created Relation includes")
    val startParts: OptionalInput<List<ID>>,
    @GraphQLDescription("If `end` is an Interface, the parts of the Interface the created Relation includes")
    val endParts: OptionalInput<List<ID>>,
    @GraphQLDescription("Initial values for all templatedFields")
    override val templatedFields: List<JSONFieldInput>,
    @GraphQLDescription("The template of the created Relation")
    val template: ID
): Input(), CreateTemplatedNodeInput {

    override fun validate() {
        super.validate()
        templatedFields.validateAndEnsureNoDuplicates()
    }
}
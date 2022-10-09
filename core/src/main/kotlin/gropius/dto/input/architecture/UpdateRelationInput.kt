package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.UpdateExtensibleNodeInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.ensureDisjoint
import gropius.dto.input.ifPresent
import gropius.dto.input.template.UpdateTemplatedNodeInput

@GraphQLDescription("Input for the updateRelation mutation")
class UpdateRelationInput(
    @GraphQLDescription("Values for templatedFields to update")
    override val templatedFields: OptionalInput<List<JSONFieldInput>>,
    @GraphQLDescription(
        """If provided, the id of the new template for the Component
        Use `templatedFields` to update fields so that they conform with the new specifications.
        No longer needed fields are automatically removed.
        Caution: the chosen Template must be compatible with the Templates of the start and end of the Relation.
        """
    )
    val template: OptionalInput<ID>,
    @GraphQLDescription("Ids of InterfaceParts of the `start` Interface to add to `startParts`")
    val addedStartParts: OptionalInput<List<ID>>,
    @GraphQLDescription("Ids of InterfaceParts of the `start` Interface to remove from `startParts`")
    val removedStartParts: OptionalInput<List<ID>>,
    @GraphQLDescription("Ids of InterfaceParts of the `end` Interface to add to `endParts`")
    val addedEndParts: OptionalInput<List<ID>>,
    @GraphQLDescription("Ids of InterfaceParts of the `end` Interface to remove from `endParts`")
    val removedEndParts: OptionalInput<List<ID>>
): UpdateExtensibleNodeInput(), UpdateTemplatedNodeInput {

    override fun validate() {
        super.validate()
        templatedFields.ifPresent {
            it.validateAndEnsureNoDuplicates()
        }
        ::addedStartParts ensureDisjoint ::removedStartParts
        ::addedEndParts ensureDisjoint ::removedEndParts
    }
}
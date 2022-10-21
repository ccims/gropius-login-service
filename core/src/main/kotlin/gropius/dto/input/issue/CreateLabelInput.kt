package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLType
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.CreateNamedNodeInput

@GraphQLDescription("Input for the createLabel mutation")
class CreateLabelInput(
    @GraphQLDescription("Initial color of the Label")
    @GraphQLType("Color")
    val color: String,
    @GraphQLDescription("IDs of Trackables the Label is added to, at least one required.")
    val trackables: List<ID>
) : CreateNamedNodeInput() {

    override fun validate() {
        super.validate()
        if (trackables.isEmpty()) {
            throw IllegalArgumentException("At least on trackable is required")
        }
    }
}
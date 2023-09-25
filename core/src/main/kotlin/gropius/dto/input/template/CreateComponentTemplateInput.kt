package gropius.dto.input.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription

@GraphQLDescription("Input for the createComponentTemplate mutation")
class CreateComponentTemplateInput(
    @GraphQLDescription("SubTemplate for all ComponentVersions of a Component with the created Template")
    val componentVersionTemplate: SubTemplateInput
) : CreateRelationPartnerTemplateInput() {

    override fun validate() {
        super.validate()
        componentVersionTemplate.validate()
    }
}
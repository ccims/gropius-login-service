package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.dto.input.common.CreateNamedNodeInput
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.template.CreateTemplatedNodeInput
import kotlin.properties.Delegates

@GraphQLDescription("Input to create a ComponentVersion")
open class ComponentVersionInput : CreateNamedNodeInput(), CreateTemplatedNodeInput {

    @GraphQLDescription("The version of the created ComponentVersion")
    var version: String by Delegates.notNull()

    @GraphQLDescription("Initial values for all templatedFields")
    override var templatedFields: List<JSONFieldInput> by Delegates.notNull()

    override fun validate() {
        super.validate()
        templatedFields.validateAndEnsureNoDuplicates()
    }
}
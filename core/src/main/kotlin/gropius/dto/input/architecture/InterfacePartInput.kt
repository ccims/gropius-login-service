package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.dto.input.common.CreateNamedNodeInput
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.template.CreateTemplatedNodeInput
import kotlin.properties.Delegates

@GraphQLDescription("Input to create an InterfacePart")
open class InterfacePartInput : CreateNamedNodeInput(), CreateTemplatedNodeInput {

    @GraphQLDescription("Initial values for all templatedFields")
    override var templatedFields: List<JSONFieldInput> by Delegates.notNull()

    override fun validate() {
        super.validate()
        templatedFields.validateAndEnsureNoDuplicates()
    }

}
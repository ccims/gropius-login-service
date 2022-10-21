package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.CreateNamedNodeInput
import gropius.dto.input.common.Input
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.ifPresent
import gropius.dto.input.template.CreateTemplatedNodeInput
import kotlin.properties.Delegates

@GraphQLDescription("Input to create an InterfaceSpecification")
open class InterfaceSpecificationInput : CreateNamedNodeInput(), CreateTemplatedNodeInput {

    @GraphQLDescription("Initial versions of the InterfaceSpecification")
    var versions: OptionalInput<List<InterfaceSpecificationVersionInput>> by Delegates.notNull()

    @GraphQLDescription("Initial defined InterfaceParts")
    var definedParts: OptionalInput<List<InterfacePartInput>> by Delegates.notNull()

    @GraphQLDescription("Initial values for all templatedFields")
    override var templatedFields: List<JSONFieldInput> by Delegates.notNull()

    @GraphQLDescription("The template of the created InterfaceSpecification")
    var template: ID by Delegates.notNull()

    override fun validate() {
        super.validate()
        versions.ifPresent {
            it.forEach(Input::validate)
        }
        definedParts.ifPresent {
            it.forEach(Input::validate)
        }
        templatedFields.validateAndEnsureNoDuplicates()
    }
}
package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.CreateNamedNodeInput
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.template.CreateTemplatedNodeInput
import kotlin.properties.Delegates

@GraphQLDescription("Input to create an InterfaceSpecificationVersion")
open class InterfaceSpecificationVersionInput : CreateNamedNodeInput(), CreateTemplatedNodeInput {

    @GraphQLDescription("Initial values for all templatedFields")
    override var templatedFields: List<JSONFieldInput> by Delegates.notNull()

    @GraphQLDescription(
        """Ids of InterfaceParts of the associated InterfaceSpecification which should be the initial `activeParts`"""
    )
    var activeParts: OptionalInput<List<ID>> by Delegates.notNull()

    @GraphQLDescription("The version of the created InterfaceSpecificationVersion")
    var version: String by Delegates.notNull()

    override fun validate() {
        super.validate()
        templatedFields.validateAndEnsureNoDuplicates()
    }

}
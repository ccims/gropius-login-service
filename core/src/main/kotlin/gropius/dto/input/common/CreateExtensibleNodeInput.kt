package gropius.dto.input.common

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.ifPresent
import gropius.model.common.ExtensibleNode
import kotlin.properties.Delegates

/**
 * Fragment for create mutation inputs for classes extending [ExtensibleNode]
 */
abstract class CreateExtensibleNodeInput : Input() {

    @GraphQLDescription("The initial value of the extension fields")
    var extensionFields: OptionalInput<List<JSONFieldInput>> by Delegates.notNull()

    override fun validate() {
        super.validate()
        extensionFields.ifPresent {
            it.validateAndEnsureNoDuplicates()
        }
    }
}
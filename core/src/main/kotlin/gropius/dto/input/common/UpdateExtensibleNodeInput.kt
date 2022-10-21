package gropius.dto.input.common

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.ifPresent
import gropius.model.common.ExtensibleNode
import kotlin.properties.Delegates

/**
 * Fragment for update mutation inputs for classes extending [ExtensibleNode]
 */
abstract class UpdateExtensibleNodeInput : UpdateNodeInput() {

    @GraphQLDescription("Extension fields to update. To remove, provide no value")
    var extensionFields: OptionalInput<List<JSONFieldInput>> by Delegates.notNull()

    override fun validate() {
        super.validate()
        extensionFields.ifPresent {
            it.validateAndEnsureNoDuplicates()
        }
    }
}
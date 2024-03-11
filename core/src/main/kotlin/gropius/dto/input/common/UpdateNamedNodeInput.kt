package gropius.dto.input.common

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.ifPresent
import gropius.model.common.NamedNode
import kotlin.properties.Delegates

/**
 * Fragment for update mutation inputs for classes extending [NamedNode]
 */
abstract class UpdateNamedNodeInput : UpdateNodeInput() {

    @GraphQLDescription("The new name of the NamedNode, must not be empty")
    var name: OptionalInput<String> by Delegates.notNull()

    @GraphQLDescription("The description of the NamedNode")
    var description: OptionalInput<String> by Delegates.notNull()

    override fun validate() {
        super.validate()
        name.ifPresent {
            if (it.isBlank()) {
                throw IllegalArgumentException("If name is defined, it must not be blank")
            }
        }
    }

}
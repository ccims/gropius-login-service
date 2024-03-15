package gropius.dto.input.common

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.common.NamedNode
import kotlin.properties.Delegates

/**
 * Fragment for create mutation inputs for classes extending [NamedNode]
 */
abstract class CreateNamedNodeInput : Input() {

    @GraphQLDescription("The name of the NamedNode, must not be blank")
    var name: String by Delegates.notNull()

    @GraphQLDescription("The description of the NamedNode")
    var description: String by Delegates.notNull()

    override fun validate() {
        super.validate()
        if (name.isBlank()) {
            throw IllegalArgumentException("Name must not be blank")
        }
    }

}
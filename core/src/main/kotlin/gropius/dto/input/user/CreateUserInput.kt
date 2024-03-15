package gropius.dto.input.user

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.dto.input.common.Input
import gropius.model.user.User
import kotlin.properties.Delegates

/**
 * Fragment for create mutation inputs for classes extending [User]
 */
abstract class CreateUserInput : Input() {

    @GraphQLDescription("The displayName of the created User")
    var displayName: String by Delegates.notNull()

    @GraphQLDescription("The email of the created User if present")
    var email: String? = null

}
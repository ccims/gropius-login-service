package gropius.dto.input.user

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.common.UpdateExtensibleNodeInput
import gropius.model.user.User
import kotlin.properties.Delegates

/**
 * Fragment for update mutation inputs for classes extending [User]
 */
abstract class UpdateUserInput : UpdateExtensibleNodeInput() {

    @GraphQLDescription("The new displayName of the User to update")
    var displayName: OptionalInput<String> by Delegates.notNull()

    @GraphQLDescription("The new email of the User to update")
    var email: OptionalInput<String?> by Delegates.notNull()

}
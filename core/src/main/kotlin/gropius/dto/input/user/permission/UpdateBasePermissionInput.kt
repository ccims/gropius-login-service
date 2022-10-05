package gropius.dto.input.user.permission

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.UpdateNodeInput
import gropius.dto.input.ensuredisjoint
import gropius.dto.input.ifPresent
import gropius.model.user.permission.BasePermission
import kotlin.properties.Delegates

/**
 * Fragment for update mutation inputs for classes extending [BasePermission]
 */
abstract class UpdateBasePermissionInput : UpdateNodeInput() {

    @GraphQLDescription("The new name of the NamedNode, must not be empty")
    var name: OptionalInput<String> by Delegates.notNull()

    @GraphQLDescription("The description of the BasePermission")
    var description: OptionalInput<String> by Delegates.notNull()

    @GraphQLDescription("The new value for allUsers")
    var allUsers: OptionalInput<Boolean> by Delegates.notNull()

    @GraphQLDescription("Ids of affected users to add")
    var addedUsers: OptionalInput<List<ID>> by Delegates.notNull()

    @GraphQLDescription("Ids of affected users to remove")
    var removedUsers: OptionalInput<List<ID>> by Delegates.notNull()

    /**
     * Entries to add, must be disjoint with [removedEntries]
     */
    abstract val addedEntries: OptionalInput<List<String>>

    /**
     * Entries to remove, must be disjoint with [addedEntries]
     */
    abstract val removedEntries: OptionalInput<List<String>>

    override fun validate() {
        super.validate()
        name.ifPresent {
            if (it.isBlank()) {
                throw IllegalArgumentException("If name is defined, it must not be blank")
            }
        }
        ::addedEntries ensuredisjoint ::removedEntries
        ::addedUsers ensuredisjoint ::removedUsers
    }

}
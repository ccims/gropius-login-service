package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.UpdateNamedNodeInput
import gropius.dto.input.ensuredisjoint
import gropius.model.architecture.Trackable
import java.net.URI
import kotlin.properties.Delegates

/**
 * Fragment for update mutation inputs for classes extending [Trackable]
 */
abstract class UpdateTrackableInput : UpdateNamedNodeInput() {

    @GraphQLDescription("The repositoryURL of the named node")
    var repositoryURL: OptionalInput<URI?> by Delegates.notNull()

    @GraphQLDescription("Ids of permissions to add, must be disjoint with removedPermissions.")
    var addedPermissions: OptionalInput<List<ID>> by Delegates.notNull()


    @GraphQLDescription(
        """Ids of permissions to remove, must be disjoint with addedPermissions.
        There must always be at least one permissions granting ADMIN to some GropiusUser left.
        """
    )
    var removedPermissions: OptionalInput<List<ID>> by Delegates.notNull()

    override fun validate() {
        super.validate()
        ::addedPermissions ensuredisjoint ::removedPermissions
    }
}
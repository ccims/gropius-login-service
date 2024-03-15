package gropius.service.common

import gropius.dto.input.common.UpdateNamedNodeInput
import gropius.dto.input.ifPresent
import gropius.model.common.NamedAuditedNode
import gropius.model.user.User
import gropius.repository.GropiusRepository
import java.time.OffsetDateTime

/**
 * Base class for services for subclasses of [NamedAuditedNode]
 *
 * @param repository the associated repository used for CRUD functionality
 * @param T the type of Node this service is used for
 * @param R Repository type associated with [T]
 */
abstract class NamedAuditedNodeService<T : NamedAuditedNode, R : GropiusRepository<T, String>>(
    repository: R
) : AuditedNodeService<T, R>(repository) {

    /**
     * Updates [node] based on [input]
     * Calls [updateAuditedNode]
     * Updates name and description
     *
     * @param node the node to update
     * @param input defines how to update the provided [node]
     * @param lastModifiedBy the user who last modified the node
     * @param lastModifiedAt the time when the node was last modified, defaults to `now()`
     */
    suspend fun updateNamedAuditedNode(
        node: NamedAuditedNode, input: UpdateNamedNodeInput, lastModifiedBy: User, lastModifiedAt: OffsetDateTime
    ) {
        updateAuditedNode(node, lastModifiedBy, lastModifiedAt)
        input.name.ifPresent {
            node.name = it
        }
        input.description.ifPresent {
            node.description = it
        }
    }

}
package gropius.service.common

import gropius.dto.input.common.UpdateNamedNodeInput
import gropius.dto.input.ifPresent
import gropius.model.common.NamedNode
import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository

/**
 * Base class for services for subclasses of [NamedNode]
 *
 * @param repository the associated repository used for CRUD functionality
 * @param T the type of Node this service is used for
 * @param R Repository type associated with [T]
 */
abstract class NamedNodeService<T : NamedNode, R : ReactiveNeo4jRepository<T, String>>(repository: R) :
    AbstractExtensibleNodeService<T, R>(repository) {

    /**
     * Updates [node] based on [input]
     * Calls [updateExtensibleNode]
     * Updates name and description
     *
     * @param node the node to update
     * @param input defines how to update the provided [node]
     */
    fun updateNamedNode(node: NamedNode, input: UpdateNamedNodeInput) {
       updateExtensibleNode(node, input)
        input.name.ifPresent {
            node.name = it
        }
        input.description.ifPresent {
            node.description = it
        }
    }

}
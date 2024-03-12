package gropius.service

import gropius.repository.common.NodeRepository
import io.github.graphglue.model.Node
import io.github.graphglue.model.property.NodeCache
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull

/**
 * Used when updating / deleting multiple nodes in a graph.
 * Provides a [cache] to ensure that each node is only loaded once.
 * Keeps track of [deletedNodes] and [updatedNodes] which can be saved to the database.
 */
interface NodeBatchUpdater {
    /**
     * Cache used to ensure that only one instance of each Node is loaded by the algorithm
     */
    val cache: NodeCache

    /**
     * Nodes which should be deleted
     */
    val deletedNodes : MutableSet<Node>

    /**
     * Nodes which are updated and need to be saved
     * This may contain nodes also present in [deletedNodes]
     */
    val internalUpdatedNodes: MutableSet<Node>

    /**
     * Nodes which are updated and need to be saved
     * Does not include any deleted nodes
     */
    val updatedNodes: Set<Node> get() = internalUpdatedNodes - deletedNodes

    /**
     * Deletes all [deletedNodes] and saves all [updatedNodes] to the database
     *
     * @param nodeRepository the repository to use for saving and deleting
     */
    suspend fun save(nodeRepository: NodeRepository) {
        nodeRepository.deleteAll(deletedNodes).awaitSingleOrNull()
        nodeRepository.saveAll(updatedNodes).collectList().awaitSingle()
    }

    /**
     * Deletes all [deletedNodes] and saves all [updatedNodes] to the database
     *
     * @param node an additional node to save, which the saved version of should be returned
     * @param nodeRepository the repository to use for saving and deleting
     * @return the saved version of [node]
     */
    suspend fun <T : Node> save(node: T, nodeRepository: NodeRepository): T {
        require(node.rawId != null || internalUpdatedNodes.filter { it::class.isInstance(node) }.all { it === node }) {
            "The provided node must be identifiable among all nodes to update (either using id or type information)"
        }

        nodeRepository.deleteAll(deletedNodes).awaitSingleOrNull()
        val updatedNodes = nodeRepository.saveAll(updatedNodes + node).collectList().awaitSingle()
        @Suppress("UNCHECKED_CAST")
        return if (node.rawId != null) {
            updatedNodes.first { it.rawId == node.rawId } as T
        } else {
            updatedNodes.first { it::class.isInstance(node) } as T
        }
    }
}
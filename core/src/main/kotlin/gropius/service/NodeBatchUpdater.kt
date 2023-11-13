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
     */
    suspend fun save(nodeRepository: NodeRepository) {
        nodeRepository.deleteAll(deletedNodes).awaitSingleOrNull()
        nodeRepository.saveAll(updatedNodes).collectList().awaitSingle()
    }
}
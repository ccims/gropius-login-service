package gropius.service

import io.github.graphglue.model.Node
import io.github.graphglue.model.property.NodeCache

/**
 * Default implementation for [NodeBatchUpdater]
 */
class NodeBatchUpdateContext : NodeBatchUpdater {

    override val cache = NodeCache()

    override val deletedNodes = mutableSetOf<Node>()

    override  val internalUpdatedNodes: MutableSet<Node> = mutableSetOf()

    override val updatedNodes: Set<Node> get() = internalUpdatedNodes - deletedNodes
}
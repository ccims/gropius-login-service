package gropius.service.architecture

import gropius.model.architecture.ComponentVersion
import gropius.model.architecture.Interface
import gropius.model.architecture.Relation
import gropius.model.architecture.RelationPartner
import gropius.service.NodeBatchUpdater

/**
 * Parent class for batch updaters operating on the architecture graph
 */
abstract class GraphUpdater(updateContext: NodeBatchUpdater) : NodeBatchUpdater by updateContext {

    /**
     * Finds all [RelationPartner]s that are connected to a [RelationPartner] via outgoing [Relation]s.
     * Also considers [Interface]s of [ComponentVersion]s.
     *
     * @param relationPartner the relation partner to start from
     * @return a set of all connected relation partners
     */
    private suspend fun findOutgoingRelationPartners(relationPartner: RelationPartner): Set<RelationPartner> {
        val result = mutableSetOf<RelationPartner>()
        val toExplore = ArrayDeque(listOf(relationPartner))
        while (toExplore.isNotEmpty()) {
            val next = toExplore.removeFirst()
            if (result.add(next)) {
                toExplore += next.outgoingRelations(cache).map { it.end(cache).value }
                expandRelationPartner(next, toExplore)
            }
        }
        return result
    }

    /**
     * Finds all [RelationPartner]s that are connected to a [RelationPartner] via incoming [Relation]s.
     * Also considers [Interface]s of [ComponentVersion]s.
     *
     * @param relationPartner the relation partner to start from
     * @return a set of all connected relation partners
     */
    private suspend fun findIncomingRelationPartners(relationPartner: RelationPartner): Set<RelationPartner> {
        val result = mutableSetOf<RelationPartner>()
        val toExplore = ArrayDeque(listOf(relationPartner))
        while (toExplore.isNotEmpty()) {
            val next = toExplore.removeFirst()
            if (result.add(next)) {
                toExplore += next.incomingRelations(cache).map { it.start(cache).value }
                expandRelationPartner(next, toExplore)
            }
        }
        return result
    }

    /**
     * Locks all incoming and outgoing [RelationPartner]s of a [RelationPartner]
     *
     * @param relationPartner the relation partner to lock
     */
    protected suspend fun lockIncomingAndOutgoingRelationPartners(relationPartner: RelationPartner) {
        val incoming = findIncomingRelationPartners(relationPartner)
        val outgoing = findOutgoingRelationPartners(relationPartner)
        internalUpdatedNodes += incoming
        internalUpdatedNodes += outgoing
    }

    /**
     * Helper to
     * - add the [ComponentVersion] of an [Interface] to the stack
     * - add the [Interface]s of a [ComponentVersion] to the stack
     *
     * @param relationPartner the relation partner to expand
     * @param stack the stack to add the expanded relation partners to
     */
    private suspend fun expandRelationPartner(relationPartner: RelationPartner, stack: ArrayDeque<RelationPartner>) {
        when (relationPartner) {
            is ComponentVersion -> {
                stack += relationPartner.interfaceDefinitions(cache).mapNotNull { it.visibleInterface(cache).value }
            }

            is Interface -> {
                stack += relationPartner.interfaceDefinition(cache).value.componentVersion(cache).value
            }
        }
    }

}
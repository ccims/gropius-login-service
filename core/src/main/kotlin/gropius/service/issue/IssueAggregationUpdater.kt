package gropius.service.issue

import gropius.model.architecture.*
import gropius.model.issue.AggregatedIssue
import gropius.model.issue.Issue
import gropius.model.template.IssueState
import gropius.model.template.IssueType
import gropius.service.NodeBatchUpdateContext
import gropius.service.NodeBatchUpdater

class IssueAggregationUpdater(updateContext: NodeBatchUpdater = NodeBatchUpdateContext()) :
    NodeBatchUpdater by updateContext {

    suspend fun changedIssueStateOrType(issue: Issue, oldState: IssueState, oldType: IssueType) {
        if (issue.type(cache).value == oldType && issue.state(cache).value.isOpen == oldState.isOpen) {
            return
        }
        val relationPartners = issue.aggregatedBy(cache).map { aggregatedBy ->
            removeIssueFromAggregatedIssue(issue, aggregatedBy)
            aggregatedBy.relationPartner(cache).value
        }
        issue.aggregatedBy(cache).clear()
        relationPartners.forEach {
            createOrUpdateAggregatedIssues(it, setOf(issue))
        }
    }

    suspend fun deletedIssue(issue: Issue) {
        issue.aggregatedBy(cache).forEach { aggregatedBy ->
            removeIssueFromAggregatedIssue(issue, aggregatedBy)
        }
    }

    suspend fun deletedComponentVersion(componentVersion: ComponentVersion) {
        relationPartnerDeleted(componentVersion)
        for (issue in componentVersion.affectingIssues(cache)) {
            aggregateIssueOnComponentIfNecessary(issue, componentVersion.component(cache).value)
        }
    }

    suspend fun addedIssueToTrackable(issue: Issue, trackable: Trackable) {
        if (trackable !is Component) {
            return
        }
        aggregateIssueOnComponentIfNecessary(issue, trackable)
    }

    suspend fun removedIssueFromTrackable(issue: Issue, trackable: Trackable) {
        if (trackable !is Component) {
            return
        }
        val aggregatedBy = issue.aggregatedBy(cache)
        val removed = mutableSetOf<AggregatedIssue>()
        aggregatedBy.forEach {
            val target = it.relationPartner(cache).value
            if (target is ComponentVersion && target.component(cache).value == trackable) {
                if (!isIssueStillAggregatedByComponentVersion(issue, target)) {
                    removeIssueFromAggregatedIssue(issue, it)
                    removed += it
                }
            }
        }
        aggregatedBy.removeAll(removed)
    }

    suspend fun createdInterface(createdInterface: Interface) {
        val definition = createdInterface.interfaceDefinition(cache).value
        val specificationVersion = definition.interfaceSpecificationVersion(cache).value
        val affectableEntities = listOf(
            createdInterface,
            specificationVersion,
            specificationVersion.interfaceSpecification(cache).value
        ) + specificationVersion.activeParts(cache)
        val affectedIssues = affectableEntities.flatMap { it.affectingIssues(cache) }.toSet()
        createOrUpdateAggregatedIssues(createdInterface, affectedIssues)
        val component = definition.componentVersion(cache).value.component(cache).value
        for (issue in affectedIssues) {
            unaggregateIssueOnComponentIfNecessary(issue, component)
        }
    }

    suspend fun deletedInterface(deletedInterface: Interface) {
        relationPartnerDeleted(deletedInterface)
        val component =
            deletedInterface.interfaceDefinition(cache).value.componentVersion(cache).value.component(cache).value
        for (issue in deletedInterface.affectingIssues(cache)) {
            aggregateIssueOnComponentIfNecessary(issue, component)
        }
    }

    suspend fun deletedInterfacePart(interfacePart: InterfacePart) {
        val interfaces = interfacePart.activeOn(cache).flatMap { version ->
            version.interfaceDefinitions(cache).mapNotNull {
                it.visibleInterface(cache).value
            }
        }
        val components = interfaces.map {
            it.interfaceDefinition(cache).value.componentVersion(cache).value.component(cache).value
        }
        interfacePart.affectingIssues(cache).forEach { issue ->
            issue.affects(cache).remove(interfacePart)
            interfaces.forEach {
                if (!isIssueStillAggregatedByInterface(issue, it)) {
                    removeIssueFromAggregatedIssueOnRelationPartner(issue, it)
                }
            }
            for (component in components) {
                aggregateIssueOnComponentIfNecessary(issue, component)
            }
        }
    }

    suspend fun updatedActiveParts(
        interfaceSpecificationVersion: InterfaceSpecificationVersion,
        addedParts: Set<InterfacePart>,
        removedParts: Set<InterfacePart>
    ) {
        val interfaces = interfaceSpecificationVersion.interfaceDefinitions(cache).mapNotNull {
            it.visibleInterface(cache).value
        }
        val newAffectingIssues = addedParts.flatMap { it.affectingIssues(cache) }.toSet()
        val potentialIssuesToRemove = removedParts.flatMap { it.affectingIssues(cache) }.toSet()
        for (inter in interfaces) {
            createOrUpdateAggregatedIssues(inter, newAffectingIssues)
            for (issue in potentialIssuesToRemove) {
                if (!isIssueStillAggregatedByInterface(issue, inter)) {
                    removeIssueFromAggregatedIssueOnRelationPartner(issue, inter)
                }
            }
        }
        val components = interfaces.map {
            it.interfaceDefinition(cache).value.componentVersion(cache).value.component(cache).value
        }.toSet()
        for (component in components) {
            for (issue in newAffectingIssues) {
                unaggregateIssueOnComponentIfNecessary(issue, component)
            }
            for (issue in potentialIssuesToRemove) {
                aggregateIssueOnComponentIfNecessary(issue, component)
            }
        }
    }

    suspend fun addedAffectedEntity(issue: Issue, affectedEntity: AffectedByIssue) {
        when (affectedEntity) {
            is Component -> {
                affectedEntity.versions(cache).forEach {
                    createOrUpdateAggregatedIssues(it, setOf(issue))
                }
            }

            is ComponentVersion -> {
                createOrUpdateAggregatedIssues(affectedEntity, setOf(issue))
                unaggregateIssueOnComponentIfNecessary(issue, affectedEntity.component(cache).value)
            }

            is Interface -> {
                addedAffectedInterfaceRelatedEntity(issue, setOf(affectedEntity))
            }

            is InterfacePart -> {
                addedAffectedInterfaceRelatedEntity(issue, affectedEntity.activeOn(cache))
            }

            is InterfaceSpecificationVersion -> {
                addedAffectedInterfaceRelatedEntity(issue, setOf(affectedEntity))
            }

            is InterfaceSpecification -> {
                addedAffectedInterfaceRelatedEntity(issue, affectedEntity.versions(cache))
            }

            is Project -> {
                // ignore, does not affect components / interfaces
            }

            else -> {
                error("Unknown affected entity")
            }
        }
    }

    suspend fun removedAffectedEntity(issue: Issue, affectedEntity: AffectedByIssue) {
        when (affectedEntity) {
            is Component -> {
                if (affectedEntity !in issue.trackables(cache) || doesIssueAffectComponentRelatedEntity(issue, affectedEntity)) {
                    affectedEntity.versions(cache).forEach {
                        if (it !in issue.affects(cache)) {
                            removeIssueFromAggregatedIssueOnRelationPartner(issue, it)
                        }
                    }
                }
            }

            is ComponentVersion -> {
                val component = affectedEntity.component(cache).value
                if (doesIssueAffectComponentRelatedEntity(issue, component)) {
                    if (component !in issue.affects(cache)) {
                        removeIssueFromAggregatedIssueOnRelationPartner(issue, affectedEntity)
                    }
                } else {
                    if (component in issue.trackables(cache)) {
                        for (componentVersion in component.versions(cache)) {
                            createOrUpdateAggregatedIssues(componentVersion, setOf(issue))
                        }
                    } else {
                        removeIssueFromAggregatedIssueOnRelationPartner(issue, affectedEntity)
                    }
                }
            }

            is Interface -> {
                removedAffectedInterfaceRelatedEntity(issue, setOf(affectedEntity))
            }

            is InterfacePart -> {
                removedAffectedInterfaceRelatedEntity(issue, affectedEntity.activeOn(cache))
            }

            is InterfaceSpecificationVersion -> {
                removedAffectedInterfaceRelatedEntity(issue, setOf(affectedEntity))
            }

            is InterfaceSpecification -> {
                removedAffectedInterfaceRelatedEntity(issue, affectedEntity.versions(cache))
            }

            is Project -> {
                // ignore, does not affect components / interfaces
            }

            else -> {
                error("Unknown affected entity")
            }
        }
    }

    private suspend fun addedAffectedInterfaceRelatedEntity(
        issue: Issue,
        interfaceSpecificationVersions: Set<InterfaceSpecificationVersion>
    ) {
        val interfaces = interfaceSpecificationVersions.flatMap { version ->
            version.interfaceDefinitions(cache).mapNotNull { it.visibleInterface(cache).value }
        }
        addedAffectedInterfaceRelatedEntity(issue, interfaces)
    }

    private suspend fun addedAffectedInterfaceRelatedEntity(
        issue: Issue,
        interfaces: Collection<Interface>
    ) {
        for (inter in interfaces) {
            createOrUpdateAggregatedIssues(inter, setOf(issue))
        }
        val components = interfaces.map {
            it.interfaceDefinition(cache).value.componentVersion(cache).value.component(cache).value
        }.toSet()
        for (component in components) {
            unaggregateIssueOnComponentIfNecessary(issue, component)
        }
    }

    private suspend fun removedAffectedInterfaceRelatedEntity(
        issue: Issue,
        interfaceSpecificationVersions: Set<InterfaceSpecificationVersion>
    ) {
        val interfaces = interfaceSpecificationVersions.flatMap { version ->
            version.interfaceDefinitions(cache).mapNotNull { it.visibleInterface(cache).value }
        }
        removedAffectedInterfaceRelatedEntity(issue, interfaces)
    }

    private suspend fun removedAffectedInterfaceRelatedEntity(
        issue: Issue,
        interfaces: Collection<Interface>
    ) {
        val addToComponentPotentially = mutableSetOf<Component>()
        for (inter in interfaces) {
            if (!isIssueStillAggregatedByInterface(issue, inter)) {
                removeIssueFromAggregatedIssueOnRelationPartner(issue, inter)
                addToComponentPotentially += inter.interfaceDefinition(cache).value.componentVersion(cache).value.component(
                    cache
                ).value
            }
        }
        for (component in addToComponentPotentially) {
            aggregateIssueOnComponentIfNecessary(issue, component)
        }
    }

    private suspend fun removeIssueFromAggregatedIssueOnRelationPartner(
        issue: Issue,
        relationPartner: RelationPartner
    ) {
        val type = issue.type(cache).value
        val isOpen = issue.state(cache).value.isOpen
        val aggregatedIssue = relationPartner.aggregatedIssues(cache).find {
            it.type(cache).value == type && it.isOpen == isOpen
        } ?: return
        removeIssueFromAggregatedIssue(issue, aggregatedIssue)
    }

    private suspend fun removeIssueFromAggregatedIssue(
        issue: Issue,
        aggregatedIssue: AggregatedIssue
    ) {
        aggregatedIssue.issues(cache).remove(issue)
        aggregatedIssue.count--
        internalUpdatedNodes += aggregatedIssue
        if (aggregatedIssue.issues(cache).isEmpty()) {
            deleteAggregatedIssue(aggregatedIssue)
        }
    }

    private suspend fun isIssueStillAggregatedByComponentVersion(
        issue: Issue,
        componentVersion: ComponentVersion
    ): Boolean {
        val affected = issue.affects(cache)
        if (componentVersion in affected || componentVersion.component(cache).value in affected) {
            return true
        }
        val component = componentVersion.component(cache).value
        if (component in issue.trackables(cache)) {
            return !doesIssueAffectComponentRelatedEntity(issue, component)
        }
        return false
    }

    private suspend fun isIssueStillAggregatedByInterface(
        issue: Issue,
        inter: Interface
    ): Boolean {
        val specificationVersion = inter.interfaceDefinition(cache).value.interfaceSpecificationVersion(cache).value
        val affectableEntities = listOf(
            inter,
            specificationVersion,
            specificationVersion.interfaceSpecification(cache).value
        ) + specificationVersion.activeParts(cache)
        return issue.affects(cache).any { it in affectableEntities }
    }

    private suspend fun doesIssueAffectComponentRelatedEntity(issue: Issue, component: Component): Boolean {
        val relatedAffectedEntities = componentRelatedEntities(component)
        return issue.affects(cache).any { it in relatedAffectedEntities }
    }

    private suspend fun componentRelatedEntities(component: Component): Set<AffectedByIssue> {
        val affected = mutableSetOf<AffectedByIssue>()
        affected += component
        for (version in component.versions(cache)) {
            affected += version
            for (interfaceDefinition in version.interfaceDefinitions(cache)) {
                val inter = interfaceDefinition.visibleInterface(cache).value
                if (inter != null) {
                    affected += inter
                    val specificationVersion = interfaceDefinition.interfaceSpecificationVersion(cache).value
                    affected += specificationVersion
                    affected += specificationVersion.interfaceSpecification(cache).value
                    affected += specificationVersion.activeParts(cache)
                }
            }
        }
        return affected
    }

    private suspend fun createOrUpdateAggregatedIssues(relationPartner: RelationPartner, issues: Set<Issue>) {
        val aggregatedIssues = relationPartner.aggregatedIssues(cache)
        val aggregatedIssueLookup = aggregatedIssues.associateBy {
            it.type(cache).value to it.isOpen
        }.toMutableMap()
        for (issue in issues) {
            val state = issue.state(cache).value
            val type = issue.type(cache).value
            aggregatedIssueLookup.getOrPut(type to state.isOpen) {
                val aggregatedIssue = AggregatedIssue(0, state.isOpen)
                aggregatedIssue.relationPartner(cache).value = relationPartner
                aggregatedIssue.type(cache).value = type
                aggregatedIssue
            }.let {
                if (it.issues(cache).add(issue)) {
                    it.count++
                }
                internalUpdatedNodes += it
            }
        }
    }

    private suspend fun relationPartnerDeleted(relationPartner: RelationPartner) {
        relationPartner.aggregatedIssues(cache).forEach {
            deleteAggregatedIssue(it)
        }
        relationPartner.affectingIssues(cache).forEach { issue ->
            issue.affects(cache).remove(relationPartner)
        }
    }

    private suspend fun deleteAggregatedIssue(aggregatedIssue: AggregatedIssue) {
        deletedNodes += aggregatedIssue
        deletedNodes += aggregatedIssue.incomingRelations(cache)
        deletedNodes += aggregatedIssue.outgoingRelations(cache)
    }

    private suspend fun aggregateIssueOnComponentIfNecessary(issue: Issue, component: Component) {
        if (component !in issue.trackables(cache)) {
            return
        }
        if (!doesIssueAffectComponentRelatedEntity(issue, component)) {
            for (componentVersion in component.versions(cache)) {
                createOrUpdateAggregatedIssues(componentVersion, setOf(issue))
            }
        }
    }

    private suspend fun unaggregateIssueOnComponentIfNecessary(issue: Issue, component: Component) {
        if (component in issue.trackables(cache)) {
            return
        }
        if (doesIssueAffectComponentRelatedEntity(issue, component)) {
            for (componentVersion in component.versions(cache)) {
                removeIssueFromAggregatedIssueOnRelationPartner(issue, componentVersion)
            }
        }
    }

}
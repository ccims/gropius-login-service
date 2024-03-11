package gropius.service.architecture

import com.expediagroup.graphql.generator.scalars.ID
import gropius.authorization.GropiusAuthorizationContext
import gropius.dto.input.architecture.*
import gropius.dto.input.common.DeleteNodeInput
import gropius.dto.input.ifPresent
import gropius.model.architecture.Component
import gropius.model.architecture.ComponentVersion
import gropius.model.architecture.InterfaceSpecificationVersion
import gropius.model.user.permission.NodePermission
import gropius.repository.architecture.ComponentRepository
import gropius.repository.architecture.ComponentVersionRepository
import gropius.repository.architecture.InterfaceSpecificationVersionRepository
import gropius.repository.common.NodeRepository
import gropius.repository.findById
import gropius.service.template.TemplatedNodeService
import io.github.graphglue.authorization.Permission
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Service

/**
 * Service for [ComponentVersion]s. Provides functions to create, update and delete
 *
 * @param repository the associated repository used for CRUD functionality
 * @param interfaceSpecificationVersionRepository used to get [InterfaceSpecificationVersion]s by id
 * @param nodeRepository used to save/delete any node
 * @param componentRepository used to get [Component]s by id
 * @param templatedNodeService used to update templatedFields
 */
@Service
class ComponentVersionService(
    repository: ComponentVersionRepository,
    private val interfaceSpecificationVersionRepository: InterfaceSpecificationVersionRepository,
    private val nodeRepository: NodeRepository,
    private val componentRepository: ComponentRepository,
    private val templatedNodeService: TemplatedNodeService,
) : RelationPartnerService<ComponentVersion, ComponentVersionRepository>(repository) {

    /**
     * Adds a [InterfaceSpecificationVersion] to a [ComponentVersion] as visible/invisible
     * Checks the authorization status
     * Requires that the [InterfaceSpecificationVersion] is part of the same [Component] as the [ComponentVersion]
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines how and which [InterfaceSpecificationVersion] to add to which [ComponentVersion]
     * @return the saved updated [ComponentVersion]
     */
    suspend fun addInterfaceSpecificationToComponentVersion(
        authorizationContext: GropiusAuthorizationContext,
        input: AddInterfaceSpecificationVersionToComponentVersionInput
    ): ComponentVersion {
        input.validate()
        updateInterfaceSpecificationOnComponentVersion(
            authorizationContext, input.componentVersion, input.interfaceSpecificationVersion
        ) { graphUpdater, componentVersion, component, interfaceSpecificationVersion ->
            val componentTemplate = component.template().value
            val interfaceSpecificationTemplate = interfaceSpecificationVersion.interfaceSpecification().value.template().value
            if (input.visible && componentTemplate !in interfaceSpecificationTemplate.canBeVisibleOnComponents()) {
                throw IllegalArgumentException(
                    "InterfaceSpecificationVersion ${interfaceSpecificationVersion.rawId} cannot be visible ComponentTemplate on ${componentTemplate.rawId}"
                )
            }
            if (input.invisible && componentTemplate !in interfaceSpecificationTemplate.canBeInvisibleOnComponents()) {
                throw IllegalArgumentException(
                    "InterfaceSpecificationVersion ${interfaceSpecificationVersion.rawId} cannot be invisible on ComponentTemplate ${componentTemplate.rawId}"
                )
            }
            graphUpdater.addInterfaceSpecificationVersionToComponentVersion(
                interfaceSpecificationVersion, componentVersion, input.visible, input.invisible
            )
        }
        return repository.findById(input.componentVersion)
    }

    /**
     * Removes a [InterfaceSpecificationVersion] from a [ComponentVersion] as visible/invisible
     * Checks the authorization status
     * Requires that the [InterfaceSpecificationVersion] is part of the same [Component] as the [ComponentVersion]
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines how and which [InterfaceSpecificationVersion] to remove from which [ComponentVersion]
     * @return the saved updated [ComponentVersion]
     */
    suspend fun removeInterfaceSpecificationFromComponentVersion(
        authorizationContext: GropiusAuthorizationContext,
        input: RemoveInterfaceSpecificationVersionFromComponentVersionInput
    ): ComponentVersion {
        input.validate()
        updateInterfaceSpecificationOnComponentVersion(
            authorizationContext, input.componentVersion, input.interfaceSpecificationVersion
        ) { graphUpdater, componentVersion, _, interfaceSpecificationVersion ->
            graphUpdater.removeInterfaceSpecificationVersionFromComponentVersion(
                interfaceSpecificationVersion, componentVersion, input.visible, input.invisible
            )
        }
        return repository.findById(input.componentVersion)
    }

    /**
     * Helper function for [addInterfaceSpecificationToComponentVersion] and [removeInterfaceSpecificationFromComponentVersion]
     * Validates the user has ADMIN permission on the [ComponentVersion]
     * Validates that the [ComponentVersion] is part of the same [Component] as the [InterfaceSpecificationVersion]
     * Creates a [ComponentGraphUpdater] and calls [updateFunction] with it
     * Saves the updatedNodes and deletes the deletedNodes
     *
     * @param authorizationContext used to check for the required permission
     * @param componentVersionId the id of the [ComponentVersion] to update
     * @param interfaceSpecificationId the id of the [InterfaceSpecificationVersion] to pass to [updateFunction]
     * @param updateFunction called with the [ComponentGraphUpdater], [ComponentVersion] and [InterfaceSpecificationVersion]
     */
    private suspend fun updateInterfaceSpecificationOnComponentVersion(
        authorizationContext: GropiusAuthorizationContext,
        componentVersionId: ID,
        interfaceSpecificationId: ID,
        updateFunction: suspend (ComponentGraphUpdater, ComponentVersion, Component, InterfaceSpecificationVersion) -> Any
    ) {
        val componentVersion = repository.findById(componentVersionId)
        checkPermission(
            componentVersion,
            Permission(NodePermission.ADMIN, authorizationContext),
            "add / remove InterfaceSpecificationVersions from the ComponentVersion"
        )
        val interfaceSpecificationVersion = interfaceSpecificationVersionRepository.findById(interfaceSpecificationId)
        val component = componentVersion.component().value
        if (interfaceSpecificationVersion.interfaceSpecification().value.component().value != component) {
            throw IllegalArgumentException(
                "InterfaceSpecificationVersion ${interfaceSpecificationVersion.rawId} is not part of Component ${component.rawId}"
            )
        }
        val graphUpdater = ComponentGraphUpdater()
        updateFunction(graphUpdater, componentVersion, component, interfaceSpecificationVersion)
        graphUpdater.save(nodeRepository)
    }

    /**
     * Creates a new [ComponentVersion] based on the provided [input]
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the [ComponentVersion]
     * @return the saved created [ComponentVersion]
     */
    suspend fun createComponentVersion(
        authorizationContext: GropiusAuthorizationContext, input: CreateComponentVersionInput
    ): ComponentVersion {
        input.validate()
        val component = componentRepository.findById(input.component)
        checkPermission(
            component,
            Permission(NodePermission.ADMIN, authorizationContext),
            "create ComponentVersions on the Component"
        )
        val componentVersion = createComponentVersion(component, input)
        componentVersion.component().value = component
        return repository.save(componentVersion).awaitSingle()
    }

    /**
     * Creates a new [ComponentVersion] based on the provided [input] on [component]
     * Does not check the authorization status, does not save the created nodes
     * Validates the [input]
     *
     * @param component the [Component] the created [ComponentVersion] is part of
     * @param input defines the [ComponentVersion]
     * @return the created [ComponentVersion]
     */
    suspend fun createComponentVersion(
        component: Component, input: ComponentVersionInput
    ): ComponentVersion {
        input.validate()
        val template = component.template().value.componentVersionTemplate().value
        val templatedFields = templatedNodeService.validateInitialTemplatedFields(template, input)
        val componentVersion =
            ComponentVersion(input.name, input.description, input.version, templatedFields)
        componentVersion.template().value = template
        return componentVersion
    }

    /**
     * Updates a [ComponentVersion] based on the provided [input]
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [ComponentVersion] to update and how
     * @return the updated [ComponentVersion]
     */
    suspend fun updateComponentVersion(
        authorizationContext: GropiusAuthorizationContext, input: UpdateComponentVersionInput
    ): ComponentVersion {
        input.validate()
        val componentVersion = repository.findById(input.id)
        checkPermission(
            componentVersion,
            Permission(NodePermission.ADMIN, authorizationContext),
            "update the ComponentVersion"
        )
        templatedNodeService.updateTemplatedFields(componentVersion, input, false)
        updateNamedNode(componentVersion, input)
        input.version.ifPresent {
            componentVersion.version = it
        }
        return repository.save(componentVersion).awaitSingle()
    }

    /**
     * Deletes a [ComponentVersion] by id
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [ComponentVersion] to delete
     */
    suspend fun deleteComponentVersion(
        authorizationContext: GropiusAuthorizationContext, input: DeleteNodeInput
    ) {
        input.validate()
        val componentVersion = repository.findById(input.id)
        checkPermission(
            componentVersion,
            Permission(NodePermission.ADMIN, authorizationContext),
            "delete the ComponentVersion"
        )
        val graphUpdater = ComponentGraphUpdater()
        graphUpdater.deleteComponentVersion(componentVersion)
        nodeRepository.saveAll(graphUpdater.updatedNodes).collectList().awaitSingle()
        nodeRepository.deleteAll(graphUpdater.deletedNodes).awaitSingleOrNull()
        repository.delete(componentVersion).awaitSingle()
    }

}
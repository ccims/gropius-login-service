package gropius.service.architecture

import gropius.authorization.GropiusAuthorizationContext
import gropius.dto.input.architecture.UpdateInterfaceDefinitionInput
import gropius.model.architecture.InterfaceDefinition
import gropius.model.user.permission.NodePermission
import gropius.repository.architecture.InterfaceDefinitionRepository
import gropius.repository.findById
import gropius.service.common.NodeService
import gropius.service.template.TemplatedNodeService
import io.github.graphglue.authorization.Permission
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Service

/**
 * Service for [InterfaceDefinition]s. Provides functions to create, update and delete
 *
 * @param repository the associated repository used for CRUD functionality
 */
@Service
class InterfaceDefinitionService(
    repository: InterfaceDefinitionRepository, private val templatedNodeService: TemplatedNodeService
) : NodeService<InterfaceDefinition, InterfaceDefinitionRepository>(repository) {

    /**
     * Updates a [InterfaceDefinition] based on the provided [input]
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [InterfaceDefinition] to update and how
     * @return the updated [InterfaceDefinition]
     */
    suspend fun updateInterfaceDefinition(
        authorizationContext: GropiusAuthorizationContext, input: UpdateInterfaceDefinitionInput
    ): InterfaceDefinition {
        input.validate()
        val interfaceDefinitionToUpdate = repository.findById(input.id)
        checkPermission(
            interfaceDefinitionToUpdate,
            Permission(NodePermission.ADMIN, authorizationContext),
            "update the InterfaceDefinition"
        )
        templatedNodeService.updateTemplatedFields(interfaceDefinitionToUpdate, input)
        return repository.save(interfaceDefinitionToUpdate).awaitSingle()
    }

}
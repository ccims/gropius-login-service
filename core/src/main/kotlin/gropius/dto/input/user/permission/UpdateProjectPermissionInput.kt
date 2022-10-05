package gropius.dto.input.user.permission

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.graphql.TypeGraphQLType
import gropius.model.user.permission.PROJECT_PERMISSION_ENTRY_NAME

@GraphQLDescription("Input for the updateProjectPermission mutation")
class UpdateProjectPermissionInput(
    @GraphQLDescription("Permission entries to add, must be disjoint with removedEntries")
    override val addedEntries: OptionalInput<List<@TypeGraphQLType(PROJECT_PERMISSION_ENTRY_NAME) String>>,
    @GraphQLDescription("Permission entries to remove, must be disjoint with addedEntries")
    override val removedEntries: OptionalInput<List<@TypeGraphQLType(PROJECT_PERMISSION_ENTRY_NAME) String>>,
) : UpdateBasePermissionInput()
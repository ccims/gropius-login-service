package gropius.dto.input.user.permission

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.graphql.TypeGraphQLType
import gropius.model.user.permission.IMS_PERMISSION_ENTRY_NAME

@GraphQLDescription("Input for the updateImsPermission mutation")
class UpdateIMSPermissionInput(
    @GraphQLDescription("Permission entries to add, must be disjoint with removedEntries")
    override val addedEntries: OptionalInput<List<@TypeGraphQLType(IMS_PERMISSION_ENTRY_NAME) String>>,
    @GraphQLDescription("Permission entries to remove, must be disjoint with addedEntries")
    override val removedEntries: OptionalInput<List<@TypeGraphQLType(IMS_PERMISSION_ENTRY_NAME) String>>,
) : UpdateBasePermissionInput()
package gropius.model.user.permission

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.graphql.TypeGraphQLType
import gropius.model.architecture.IMS
import gropius.model.architecture.IMSProject
import io.github.graphglue.model.DomainNode

/**
 * The name of the IMSPermissionEntry GraphQL enum
 */
const val IMS_PERMISSION_ENTRY_NAME = "IMSPermissionEntry"

@DomainNode(searchQueryName = "searchIMSPermissions")
@GraphQLDescription("NodePermission to grant specific permissions to a set of IMSs.")
class IMSPermission(
    name: String, description: String, entries: MutableList<String>, allUsers: Boolean
) : NodePermission<IMS>(name, description, entries, allUsers) {

    companion object {
        /**
         * Permission to check if a user can create [IMSProject]s with the [IMS]
         */
        const val SYNC_TRACKABLES = "SYNC_TRACKABLES"
    }

    @GraphQLDescription(ENTRIES_DESCRIPTION)
    override val entries: MutableList<@TypeGraphQLType(IMS_PERMISSION_ENTRY_NAME) String>
        get() = super.entries

}
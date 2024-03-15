package gropius.model.common

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.ExtensionField
import io.github.graphglue.model.Node
import org.springframework.data.annotation.Version

/**
 * Name of the bean which provides the permission extension field
 */
const val PERMISSION_FIELD_BEAN = "permissionFieldBean"

@DomainNode
@GraphQLDescription("Shared extensions to the node type.")
@ExtensionField(PERMISSION_FIELD_BEAN)
abstract class BaseNode : Node() {

    /**
     * Version used for optimistic locking
     */
    @Version
    private var nodeVersion: Long = 0

}
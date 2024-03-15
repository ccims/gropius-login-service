package gropius.model.common

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import com.expediagroup.graphql.generator.annotations.GraphQLType
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.JsonNodeFactory
import gropius.model.template.JSONField
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.ExtensionField
import io.github.graphglue.model.Node
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.annotation.Version
import org.springframework.data.neo4j.core.schema.CompositeProperty

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
    private var version: Long = 0

}
package gropius.graphql.filter

import graphql.Scalars
import graphql.schema.GraphQLInputType
import gropius.model.architecture.Project
import io.github.graphglue.authorization.Permission
import io.github.graphglue.connection.filter.definition.FilterEntryDefinition
import io.github.graphglue.connection.filter.model.FilterEntry
import io.github.graphglue.data.execution.CypherConditionGenerator
import io.github.graphglue.definition.NodeDefinitionCollection
import io.github.graphglue.util.CacheMap

class PartOfProjectFilterEntryDefinition(
    private val nodeDefinitionCollection: NodeDefinitionCollection,
) : FilterEntryDefinition("partOfProject", "Filters for RelationPartners which are part of a Project's component graph") {

    /**
     * Provides a condition generator used to filter for Projects which the Permissions allows to access
     *
     * @param permission the current read permission, used to only consider nodes in filters which match the permission
     * @return the generated condition generator
     */
    fun generateAuthorizationCondition(permission: Permission): CypherConditionGenerator {
        return nodeDefinitionCollection.generateAuthorizationCondition(
            nodeDefinitionCollection.getNodeDefinition<Project>(),
            permission
        )
    }

    override fun parseEntry(value: Any?, permission: Permission?): FilterEntry {
        return PartOfProjectFilterEntry(
            value!! as String,
            this,
            permission
        )
    }

    override fun toGraphQLType(inputTypeCache: CacheMap<String, GraphQLInputType>): GraphQLInputType = Scalars.GraphQLID
}
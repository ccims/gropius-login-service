package gropius.graphql.filter

import graphql.schema.GraphQLInputType
import graphql.schema.GraphQLList
import graphql.schema.GraphQLNonNull
import graphql.schema.GraphQLTypeReference
import gropius.graphql.TIMELINE_ITEM_TYPE_NAME
import io.github.graphglue.authorization.Permission
import io.github.graphglue.connection.filter.definition.FilterEntryDefinition
import io.github.graphglue.connection.filter.model.FilterEntry
import io.github.graphglue.util.CacheMap

/**
 * Filter definition entry for types of timeline items
 * Allows to filter by list of types
 */
class TimelineItemTypeFilterEntryDefinition : FilterEntryDefinition(
    "timelineItemTypes", "Filter for specific timeline items. Entries are joined by OR"
) {

    @Suppress("UNCHECKED_CAST")
    override fun parseEntry(value: Any?, permission: Permission?): FilterEntry {
        return TimelineItemTypeFilterEntry(value as List<String>, this)
    }

    override fun toGraphQLType(inputTypeCache: CacheMap<String, GraphQLInputType>): GraphQLInputType {
        return GraphQLList(GraphQLNonNull(GraphQLTypeReference(TIMELINE_ITEM_TYPE_NAME)))
    }

}
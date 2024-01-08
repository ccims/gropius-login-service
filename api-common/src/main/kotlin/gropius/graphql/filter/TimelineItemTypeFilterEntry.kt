package gropius.graphql.filter

import io.github.graphglue.connection.filter.model.FilterEntry
import org.neo4j.cypherdsl.core.Condition
import org.neo4j.cypherdsl.core.Conditions
import org.neo4j.cypherdsl.core.Node

/**
 * Parsed filter entry of a [TimelineItemTypeFilterEntryDefinition]
 *
 * @param value the value provided by the user
 * @param definition [TimelineItemTypeFilterEntryDefinition] used to create this entry
 */
class TimelineItemTypeFilterEntry(
    private val value: List<String>, definition: TimelineItemTypeFilterEntryDefinition
) : FilterEntry(definition) {

    override fun generateCondition(node: Node): Condition {
        return if (value.isEmpty()) {
            Conditions.isFalse()
        } else {
            value.fold(Conditions.noCondition()) { condition, entry ->
                condition.or(node.hasLabels(entry))
            }
        }
    }

}
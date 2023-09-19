package gropius.graphql.filter

import gropius.model.user.permission.TrackablePermission
import io.github.graphglue.authorization.Permission
import io.github.graphglue.connection.filter.model.Filter
import io.github.graphglue.connection.filter.model.FilterEntry
import org.neo4j.cypherdsl.core.Condition
import org.neo4j.cypherdsl.core.Conditions
import org.neo4j.cypherdsl.core.Cypher
import org.neo4j.cypherdsl.core.Node

class AffectedByIssueRelatedToFilterEntry(
    val filter: String,
    private val relatedToFilterEntryDefinition: AffectedByIssueRelatedToFilterEntryDefinition,
    private val permission: Permission?

) : FilterEntry(relatedToFilterEntryDefinition) {

    override fun generateCondition(node: Node): Condition {
        val relatedNode = Cypher.anyNode(node.requiredSymbolicName.value + "_")
        val relationship = node.relationshipTo(relatedNode).min(0)
            .withProperties(mapOf(TrackablePermission.RELATED_ISSUE_AFFECTED_ENTITY to Cypher.literalTrue()))
        val authCondition = if (permission != null) {
            relatedToFilterEntryDefinition.generateAuthorizationCondition(permission).generateCondition(relatedNode)
        } else {
            Conditions.isTrue()
        }
        return Cypher.match(relationship).where(authCondition).asCondition()
    }

}
package gropius.graphql.filter

import gropius.model.user.permission.ProjectPermission
import gropius.model.user.permission.TrackablePermission
import io.github.graphglue.authorization.Permission
import io.github.graphglue.connection.filter.model.Filter
import io.github.graphglue.connection.filter.model.FilterEntry
import org.neo4j.cypherdsl.core.Condition
import org.neo4j.cypherdsl.core.Conditions
import org.neo4j.cypherdsl.core.Cypher
import org.neo4j.cypherdsl.core.Node

class PartOfProjectFilterEntry(
    val filter: String,
    private val partOfProjectFilterEntryDefinition: PartOfProjectFilterEntryDefinition,
    private val permission: Permission?

) : FilterEntry(partOfProjectFilterEntryDefinition) {

    override fun generateCondition(node: Node): Condition {
        val relatedNode = Cypher.anyNode(node.requiredSymbolicName.value + "_")
        val relationship = node.relationshipTo(relatedNode).min(0)
            .withProperties(mapOf(ProjectPermission.PART_OF_PROJECT to Cypher.literalTrue()))
        val authCondition = if (permission != null) {
            partOfProjectFilterEntryDefinition.generateAuthorizationCondition(permission).generateCondition(relatedNode)
        } else {
            Conditions.noCondition()
        }
        val idCondition = relatedNode.property("id").isEqualTo(Cypher.anonParameter(filter))
        return Cypher.match(relationship).where(idCondition.and(authCondition)).asCondition()
    }

}
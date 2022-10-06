package gropius.model.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import gropius.model.common.NamedNode
import gropius.model.issue.Issue
import io.github.graphglue.model.Direction
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import io.github.graphglue.model.NodeRelationship
import io.github.graphglue.model.property.NodeCache
import org.springframework.data.annotation.Transient

@DomainNode
@GraphQLDescription(
    """Entities that can be affected by an Issue, meaning that this entity is in some regard 
    impacted by e.g. a bug described by an issue, or the non-present of a feature described by an issue.
    """
)
abstract class AffectedByIssue(name: String, description: String) : NamedNode(name, description) {

    @NodeRelationship(Issue.AFFECTS, Direction.INCOMING)
    @GraphQLDescription("The issues which affect this entity")
    @FilterProperty
    @delegate:Transient
    val affectingIssues by NodeSetProperty<Issue>()

    /**
     * Gets the [Trackable] this is part of, can be used to determine if this can be affected by an [Issue]
     *
     * @param cache cache used for accessing properties
     * @return the [Trackable] this is part of
     */
    @GraphQLIgnore
    abstract suspend fun relatedTrackable(cache: NodeCache? = null): Trackable

}
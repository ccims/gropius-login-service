package gropius.model.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.issue.Issue
import io.github.graphglue.model.Direction
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import io.github.graphglue.model.NodeRelationship
import org.springframework.data.annotation.Transient

@DomainNode("issueTemplates")
@GraphQLDescription(
    """Template for Issues.
    Defines templated fields with specific types (defined using JSON schema).
    Defines possible IssueTypes, IssueStates and IssuePriorities for Issues with this Template,
    possible AssignmentTypes for Assignments to Issues with this template, and possible 
    RelationTypes for outgoing IssueRelations for Issues with this template.
    All those are derived, if this Template extends another IssueTemplate.
    """
)
class IssueTemplate(
    name: String, description: String, templateFieldSpecifications: MutableMap<String, String>, isDeprecated: Boolean
) : Template<Issue, IssueTemplate>(name, description, templateFieldSpecifications, isDeprecated) {

    @NodeRelationship(IssueType.PART_OF, Direction.INCOMING)
    @GraphQLDescription("Set of all types Issues with this Template can have.")
    @FilterProperty
    @delegate:Transient
    val issueTypes by NodeSetProperty<IssueType>()

    @NodeRelationship(IssueState.PART_OF, Direction.INCOMING)
    @GraphQLDescription("Set of all states Issues with this Template can have.")
    @FilterProperty
    @delegate:Transient
    val issueStates by NodeSetProperty<IssueState>()

    @NodeRelationship(AssignmentType.PART_OF, Direction.INCOMING)
    @GraphQLDescription("Set of all types Assignments to Issues with this Template can have.")
    @FilterProperty
    @delegate:Transient
    val assignmentTypes by NodeSetProperty<AssignmentType>()

    @NodeRelationship(IssuePriority.PART_OF, Direction.INCOMING)
    @GraphQLDescription("Set of all priorities Issues with this Template can have.")
    @FilterProperty
    @delegate:Transient
    val issuePriorities by NodeSetProperty<IssuePriority>()

    @NodeRelationship(IssueRelationType.PART_OF, Direction.INCOMING)
    @GraphQLDescription("Set of all types outgoing IssueRelations of Issues with this Template can have")
    @FilterProperty
    @delegate:Transient
    val relationTypes by NodeSetProperty<IssueRelationType>()

}
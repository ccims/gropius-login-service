package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the changeIssuePriority mutation")
class ChangeIssuePriorityInput(
    @GraphQLDescription("The id of the Issue of which the priority is updated")
    val issue: ID,
    @GraphQLDescription("The id of the new priority, must be an IssuePriority of the used IssueTemplate")
    val priority: ID?
) : Input()
package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the removeLabelFromIssue mutation")
class RemoveLabelFromIssueInput(
    @GraphQLDescription("The id of the Label to remove")
    val label: ID,
    @GraphQLDescription("The id of the Issue where to remove the Label")
    val issue: ID
) : Input()
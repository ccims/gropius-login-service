package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the addLabelToIssue mutation")
class AddLabelToIssueInput(
    @GraphQLDescription("The id of the Label to add")
    val label: ID,
    @GraphQLDescription("The id of the Issue where to add the Label")
    val issue: ID
) : Input()
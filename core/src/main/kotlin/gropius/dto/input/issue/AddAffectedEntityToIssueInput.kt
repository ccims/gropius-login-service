package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the addAffectedEntityToIssue mutation")
class AddAffectedEntityToIssueInput(
    @GraphQLDescription("The id of the AffectedByIssue which is affected by the Issue")
    val affectedEntity: ID,
    @GraphQLDescription("The id of the Issue which affects the entity")
    val issue: ID
) : Input()
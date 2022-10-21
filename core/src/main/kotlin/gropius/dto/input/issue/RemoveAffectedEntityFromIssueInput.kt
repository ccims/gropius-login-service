package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the removeAffectedEntityFromIssue mutation")
class RemoveAffectedEntityFromIssueInput(
    @GraphQLDescription("The id of the AffectedByIssue which is no longer affected by the Issue")
    val affectedEntity: ID,
    @GraphQLDescription("The id of the Issue which no longer affects the entity")
    val issue: ID
) : Input()
package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input
import java.time.OffsetDateTime

@GraphQLDescription("Input for the changeIssueStartDate mutation")
class ChangeIssueStartDateInput(
    @GraphQLDescription("The id of the Issue of which the startDate is updated")
    val issue: ID,
    @GraphQLDescription("The new startDate")
    val startDate: OffsetDateTime?
) : Input()
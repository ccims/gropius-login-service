package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input
import java.time.Duration

@GraphQLDescription("Input for the changeIssueSpentTime mutation")
class ChangeIssueSpentTimeInput(
    @GraphQLDescription("The id of the Issue of which the spentTime is updated")
    val issue: ID,
    @GraphQLDescription("The new spentTime")
    val spentTime: Duration?
) : Input()
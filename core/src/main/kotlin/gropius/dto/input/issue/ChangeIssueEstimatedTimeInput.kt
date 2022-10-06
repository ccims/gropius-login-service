package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input
import java.time.Duration

@GraphQLDescription("Input for the changeIssueEstimatedTime mutation")
class ChangeIssueEstimatedTimeInput(
    @GraphQLDescription("The id of the Issue of which the estimatedTime is updated")
    val issue: ID,
    @GraphQLDescription("The new estimatedTime")
    val estimatedTime: Duration?
) : Input()
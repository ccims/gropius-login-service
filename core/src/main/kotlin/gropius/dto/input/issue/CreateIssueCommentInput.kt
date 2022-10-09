package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.CreateExtensibleNodeInput

@GraphQLDescription("Input for the createIssueComment mutation")
class CreateIssueCommentInput(
    @GraphQLDescription("The id of the Issue the IssueComment is created on")
    val issue: ID,
    @GraphQLDescription("Initial body of the IssueComment")
    val body: String,
    @GraphQLDescription("Ids of initially referenced artefacts")
    val referencedArtefacts: OptionalInput<List<ID>>
) : CreateExtensibleNodeInput()
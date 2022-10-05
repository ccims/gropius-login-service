package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the addArtefactToIssue mutation")
class AddArtefactToIssueInput(
    @GraphQLDescription("The id of the Artefact to add")
    val artefact: ID,
    @GraphQLDescription("The id of the Issue where to add the Artefact")
    val issue: ID
) : Input()
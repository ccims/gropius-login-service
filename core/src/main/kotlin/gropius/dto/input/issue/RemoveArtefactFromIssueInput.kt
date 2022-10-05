package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input for the removeArtefactFromIssue mutation")
class RemoveArtefactFromIssueInput(
    @GraphQLDescription("The id of the Artefact to remove")
    val artefact: ID,
    @GraphQLDescription("The id of the Issue where to remove the Artefact")
    val issue: ID
) : Input()
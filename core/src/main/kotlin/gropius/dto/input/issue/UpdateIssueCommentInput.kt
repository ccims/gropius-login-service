package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.ensureDisjoint

@GraphQLDescription("Input for the updateIssueComment mutation")
class UpdateIssueCommentInput(
    @GraphQLDescription("Ids of Artefacts which should be added to `referencedArtefacts`")
    val addedReferencedArtefacts: OptionalInput<List<ID>>,
    @GraphQLDescription("Ids of Artefacts which should be removed from `referencedArtefacts`")
    val removedReferencedArtefacts: OptionalInput<List<ID>>
) : UpdateCommentInput() {

    override fun validate() {
        super.validate()
        ::addedReferencedArtefacts ensureDisjoint ::removedReferencedArtefacts
    }
}
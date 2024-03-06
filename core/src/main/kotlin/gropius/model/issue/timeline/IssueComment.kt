package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import com.expediagroup.graphql.generator.annotations.GraphQLName
import gropius.model.issue.Artefact
import io.github.graphglue.model.Direction
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.FilterProperty
import io.github.graphglue.model.NodeRelationship
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription(
    """Comment on an Issue.
    Can reference Artefacts.
    Can be deleted, if deleted, the body is set to an empty String and the referencedComments are cleared.
    Keeps track when it was last edited and by who, but does not keep track of the change history.
    READ is granted if READ is granted on `issue`.
    """
)
class IssueComment(
    createdAt: OffsetDateTime,
    lastModifiedAt: OffsetDateTime,
    @property:GraphQLIgnore
    var body: String,
    bodyLastEditedAt: OffsetDateTime,
    @property:GraphQLDescription("If true, the IssueComment was deleted and the body is no longer visible.")
    @GraphQLName("isDeleted")
    @FilterProperty
    var isCommentDeleted: Boolean
) : Comment(createdAt, lastModifiedAt, bodyLastEditedAt) {

    companion object {
        const val ANSWERS = "ANSWERS"
        const val REFERENCED_ARTEFACT = "REFERENCED_ARTEFACT"
    }

    @NodeRelationship(ANSWERS, Direction.OUTGOING)
    @GraphQLDescription("The Comment this IssueComment is an answers to.")
    @FilterProperty
    val answers by NodeProperty<Comment?>()

    @NodeRelationship(REFERENCED_ARTEFACT, Direction.OUTGOING)
    @GraphQLDescription("Referenced Artefacts. Changes to not cause lastEditedAt/lastEditedBy to change.")
    @FilterProperty
    val referencedArtefacts by NodeSetProperty<Artefact>()

}
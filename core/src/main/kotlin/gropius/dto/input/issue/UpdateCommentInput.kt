package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.common.UpdateNodeInput
import gropius.model.issue.timeline.Comment
import kotlin.properties.Delegates

/**
 * Fragment for update mutation inputs for classes extending [Comment]
 */
abstract class UpdateCommentInput : UpdateNodeInput() {

    @GraphQLDescription("The body of the Comment")
    var body: OptionalInput<String> by Delegates.notNull()

}
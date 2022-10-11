package gropius.dto.input.issue

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.CreateExtensibleNodeInput
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.validateAndEnsureNoDuplicates
import gropius.dto.input.template.CreateTemplatedNodeInput

@GraphQLDescription("Input for the createIssue mutation")
class CreateIssueInput(
    @GraphQLDescription("Initial values for all templatedFields")
    override val templatedFields: List<JSONFieldInput>,
    @GraphQLDescription("The template of the created Issue")
    val template: ID,
    @GraphQLDescription("The title of the created Issue")
    val title: String,
    @GraphQLDescription("Ids of Trackables the Issue is initially on, must not be empty")
    val trackables: List<ID>,
    @GraphQLDescription("The body of the created Issue")
    val body: String,
    @GraphQLDescription("The id of the type of the created Issue, must be compatible with template")
    val type: ID,
    @GraphQLDescription("The id of the state of the created Issue, must be compatible with template ")
    val state: ID
) : CreateExtensibleNodeInput(), CreateTemplatedNodeInput {

    override fun validate() {
        super.validate()
        templatedFields.validateAndEnsureNoDuplicates()
        if (trackables.isEmpty()) {
            throw IllegalStateException("An Issue must be on at least one Trackable")
        }
    }
}
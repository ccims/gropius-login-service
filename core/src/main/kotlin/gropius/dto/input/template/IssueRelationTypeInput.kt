package gropius.dto.input.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.dto.input.common.CreateNamedNodeInput

@GraphQLDescription("Input to create an IssueRelationType")
class IssueRelationTypeInput(
    @GraphQLDescription("The inverse name of the IssueRelationType, must not be blank")
    val inverseName: String
) : CreateNamedNodeInput() {

    override fun validate() {
        super.validate()
        if (inverseName.isBlank()) {
            throw IllegalArgumentException("Inverse name must not be blank")
        }
    }
}
package gropius.dto.input.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.dto.input.common.CreateNamedNodeInput

@GraphQLDescription("Input to create an IssueState")
class IssueStateInput(
    @GraphQLDescription("The value for the isOpen field of the created IssueState")
    val isOpen: Boolean
) : CreateNamedNodeInput()
package gropius.model.template.style

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import io.github.graphglue.model.DomainNode

@DomainNode
@GraphQLDescription("Fill style of a shape")
class FillStyle(
    @GraphQLDescription("The color of the fill")
    val color: String
) : BaseStyle()
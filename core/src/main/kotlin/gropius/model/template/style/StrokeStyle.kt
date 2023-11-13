package gropius.model.template.style

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import io.github.graphglue.model.DomainNode

@DomainNode
@GraphQLDescription("Style of the stroke")
class StrokeStyle(
    @GraphQLDescription("The color of the stroke")
    val color: String?,
    @GraphQLDescription("The dash pattern of the stroke")
    val dash: List<Double>?
) : BaseStyle()
package gropius.dto.input.template.style

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.dto.input.common.Input

@GraphQLDescription("Input to create a FillStyle")
class FillStyleInput(
    @GraphQLDescription("The color of the fill")
    val color: String
) : Input()
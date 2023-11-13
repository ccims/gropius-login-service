package gropius.dto.input.template.style

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.common.Input

@GraphQLDescription("Input to create a StrokeStyle")
class StrokeStyleInput(
    @GraphQLDescription("The color of the stroke")
    val color: OptionalInput<String>,
    @GraphQLDescription("The dash pattern of the stroke")
    val dash: OptionalInput<List<Double>>
) : Input()
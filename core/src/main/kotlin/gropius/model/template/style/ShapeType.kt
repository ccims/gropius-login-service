package gropius.model.template.style

import com.expediagroup.graphql.generator.annotations.GraphQLDescription

@GraphQLDescription("Type of a Shape")
enum class ShapeType {
    @GraphQLDescription("A Rectangle")
    RECT,

    @GraphQLDescription("A Circle")
    CIRCLE,

    @GraphQLDescription("An Ellipse")
    ELLIPSE,

    @GraphQLDescription("A Rhombus")
    RHOMBUS,

    @GraphQLDescription("A Hexagon")
    HEXAGON,
}
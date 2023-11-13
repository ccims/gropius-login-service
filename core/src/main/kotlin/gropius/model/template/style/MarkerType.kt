package gropius.model.template.style

import com.expediagroup.graphql.generator.annotations.GraphQLDescription

@GraphQLDescription("Type of a Relation marker")
enum class MarkerType {
    @GraphQLDescription("A regular arrow")
    ARROW,

    @GraphQLDescription("A diamond")
    DIAMOND,

    @GraphQLDescription("A filled diamond")
    FILLED_DIAMOND,

    @GraphQLDescription("A triangle")
    TRIANGLE,

    @GraphQLDescription("A filled triangle")
    FILLED_TRIANGLE,

    @GraphQLDescription("A circle")
    CIRCLE,

    @GraphQLDescription("A filled circle")
    FILLED_CIRCLE
}
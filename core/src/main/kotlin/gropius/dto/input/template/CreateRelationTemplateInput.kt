package gropius.dto.input.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.ifPresent
import gropius.dto.input.template.style.StrokeStyleInput
import gropius.model.template.style.MarkerType

@GraphQLDescription("Input for the createRelationTemplate mutation")
class CreateRelationTemplateInput(
    @GraphQLDescription("Defines which Relations can use the created Template, at least one RelationCondition has to match (logical OR)")
    val relationConditions: List<RelationConditionInput>,
    @GraphQLDescription("The type of the marker at the end of the relation.")
    val markerType: MarkerType,
    @GraphQLDescription("Style of the stroke")
    val stroke: OptionalInput<StrokeStyleInput>
) : CreateTemplateInput() {

    override fun validate() {
        super.validate()
        relationConditions.forEach { it.validate() }
        stroke.ifPresent { it.validate() }
    }
}
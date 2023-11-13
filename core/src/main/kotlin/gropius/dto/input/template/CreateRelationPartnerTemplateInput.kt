package gropius.dto.input.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import gropius.dto.input.ifPresent
import gropius.dto.input.template.style.FillStyleInput
import gropius.dto.input.template.style.StrokeStyleInput
import gropius.model.template.style.ShapeType
import kotlin.properties.Delegates

abstract class CreateRelationPartnerTemplateInput : CreateTemplateInput() {

    @GraphQLDescription("Style of the fill")
    var fill: OptionalInput<FillStyleInput> by Delegates.notNull()

    @GraphQLDescription("Style of the stroke")
    var stroke: OptionalInput<StrokeStyleInput> by Delegates.notNull()

    @GraphQLDescription("The corner radius of the shape, ignored for circle/ellipse")
    var shapeRadius: OptionalInput<Double> by Delegates.notNull()

    @GraphQLDescription("The type of the shape")
    var shapeType: ShapeType by Delegates.notNull()

    override fun validate() {
        super.validate()
        fill.ifPresent { it.validate() }
        stroke.ifPresent { it.validate() }
    }
}
package gropius.dto.input.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.util.schema.Schema

@GraphQLDescription("Input to create a SubTemplate, where all templatedFieldSpecifications must allow null as value")
class NullableSubTemplateInput : SubTemplateInput() {

    override fun validateJsonSchema(schema: Schema, name: String) {
        super.validateJsonSchema(schema, name)
        if (!schema.nullable) {
            throw IllegalArgumentException("TemplatedField $name must allow null")
        }
    }

}
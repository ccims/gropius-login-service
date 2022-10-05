package gropius.dto.input.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.fasterxml.jackson.databind.JsonNode
import com.networknt.schema.JsonSchema
import com.networknt.schema.JsonSchemaFactory
import com.networknt.schema.SpecVersionDetector
import gropius.dto.input.common.CreateNamedNodeInput
import gropius.dto.input.common.JSONFieldInput
import gropius.dto.input.common.ensureNoDuplicates
import gropius.dto.input.ifPresent
import gropius.model.template.BaseTemplate
import kotlin.properties.Delegates

/**
 * Fragment for create mutation inputs for classes extending [BaseTemplate]
 */
abstract class CreateBaseTemplateInput : CreateNamedNodeInput() {

    @GraphQLDescription(
        """Additional initial templateFieldSpecifications, should be a JSON schema JSON.
        Must be disjoint with templateFieldSpecifications of templates this template extends.
        """
    )
    var templateFieldSpecifications: OptionalInput<List<JSONFieldInput>> by Delegates.notNull()

    override fun validate() {
        super.validate()
        templateFieldSpecifications.ifPresent {
            it.ensureNoDuplicates()
            for (field in it) {
                val schema = field.value as JsonNode
                val jsonSchema =
                    JsonSchemaFactory.getInstance(SpecVersionDetector.detect(field.value)).getSchema(schema)
                validateJsonSchema(jsonSchema, field.name)
            }
        }
    }

    /**
     * Can be overridden to further validate the schema
     *
     * @param schema the JSON schema to validate
     * @param name the name of the field
     */
    open fun validateJsonSchema(schema: JsonSchema, name: String) {}
}
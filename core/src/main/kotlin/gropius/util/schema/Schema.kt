package gropius.util.schema

import graphql.schema.validation.InvalidSchemaException

/**
 * Represents a JSON Type Definition schema.
 * Modified version of https://github.com/jsontypedef/json-typedef-java/blob/master/src/main/java/com/jsontypedef/jtd/Schema.java
 */
class Schema(
    val nullable: Boolean = false,
    val metadata: Map<String, Any>? = null,
    val ref: String? = null,
    val type: Type? = null,
    val enum: Set<String>? = null,
    val elements: Schema? = null,
    val properties: Map<String, Schema>? = null,
    val optionalProperties: Map<String, Schema>? = null,
    val values: Schema? = null,
    val discriminator: String? = null,
    val mapping: Map<String, Schema>? = null,
    val definitions: Map<String, Schema>? = null
) {

    /**
     * Ensures the schema is a valid root schema.
     *
     * The JSON Type Definition has some rules for the correctness of a schema
     * that go beyond what can be represented in Java's type system. This method
     * will verify these rules, such as ensuring that all references have a
     * corresponding definition, and only valid combinations of JSON Typedef
     * keywords are used.
     *
     * @throws InvalidSchemaException if the schema is not valid
     */
    fun verify() {
        verify(this)
    }

    /**
     * Verifies that this schema is valid
     *
     * @param root the root schema
     * @throws InvalidSchemaException if the schema is not valid
     */
    private fun verify(root: Schema) {
        val formSignature = setOf(
            if (ref != null) SchemaField.REF else null,
            if (type != null) SchemaField.TYPE else null,
            if (enum != null) SchemaField.ENUM else null,
            if (elements != null) SchemaField.ELEMENTS else null,
            if (properties != null) SchemaField.PROPERTIES else null,
            if (optionalProperties != null) SchemaField.OPTIONAL_PROPERTIES else null,
            if (values != null) SchemaField.VALUES else null,
            if (discriminator != null) SchemaField.DISCRIMINATOR else null,
            if (mapping != null) SchemaField.MAPPING else null
        ).filterNotNull().toSet()

        val formOk = formSignature in VALID_FORMS
        if (!formOk) {
            throw InvalidSchemaException("invalid form")
        }

        if (this.definitions != null) {
            if (this !== root) {
                throw InvalidSchemaException("non-root definition")
            }

            for (schema in definitions.values) {
                schema.verify(root)
            }
        }

        if (this.ref != null) {
            if (root.definitions == null || !root.definitions.containsKey(this.ref)) {
                throw InvalidSchemaException("ref to non-existent definition")
            }
        }

        if (this.enum != null) {
            if (enum.isEmpty()) {
                throw InvalidSchemaException("empty enum")
            }
        }

        if (this.elements != null) {
            elements.verify(root)
        }

        if (this.properties != null) {
            for (schema in properties.values) {
                schema.verify(root)
            }
        }

        if (this.optionalProperties != null) {
            for (schema in optionalProperties.values) {
                schema.verify(root)
            }
        }

        if (this.properties != null && this.optionalProperties != null) {
            for (key in properties.keys) {
                if (optionalProperties.containsKey(key)) {
                    throw InvalidSchemaException("properties shares keys with optionalProperties")
                }
            }
        }

        if (this.values != null) {
            values.verify(root)
        }

        if (this.mapping != null) {
            for (schema in mapping.values) {
                schema.verify(root)

                if (schema.nullable) {
                    throw InvalidSchemaException("mapping value has nullable set to true")
                }

                if (schema.form !== Form.PROPERTIES) {
                    throw InvalidSchemaException("mapping value not of properties form")
                }

                if (schema.properties != null && schema.properties.containsKey(this.discriminator)) {
                    throw InvalidSchemaException("discriminator shares keys with mapping properties")
                }

                if (schema.optionalProperties != null && schema.optionalProperties.containsKey(this.discriminator)) {
                    throw InvalidSchemaException("discriminator shares keys with mapping optionalProperties")
                }
            }
        }
    }

    /**
     * Gets the form the `Schema` takes on.
     *
     * The return value of this method is not meaningful if the `Schema` is
     * not a valid schema, such as if calling `verify` on its containing
     * root schema raises `InvalidSchemaException`.
     *
     * @return the form of the schema
     */
    val form: Form
        get() = if (this.ref != null) {
            Form.REF
        } else if (this.type != null) {
            Form.TYPE
        } else if (this.enum != null) {
            Form.ENUM
        } else if (this.elements != null) {
            Form.ELEMENTS
        } else if (this.properties != null) {
            Form.PROPERTIES
        } else if (this.optionalProperties != null) {
            Form.PROPERTIES
        } else if (this.values != null) {
            Form.VALUES
        } else if (this.discriminator != null) {
            Form.DISCRIMINATOR
        } else {
            throw IllegalStateException("invalid form")
        }

    companion object {

        /**
         * Allowed combinations of JSON Typedef keywords.
         */
        private val VALID_FORMS = listOf(
            setOf(SchemaField.REF),
            setOf(SchemaField.TYPE),
            setOf(SchemaField.ENUM),
            setOf(SchemaField.ELEMENTS),
            setOf(SchemaField.PROPERTIES),
            setOf(SchemaField.OPTIONAL_PROPERTIES),
            setOf(SchemaField.PROPERTIES, SchemaField.OPTIONAL_PROPERTIES),
            setOf(SchemaField.VALUES),
            setOf(SchemaField.DISCRIMINATOR, SchemaField.MAPPING),
        )
    }
}

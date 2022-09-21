package gropius.graphql

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.JsonNodeFactory
import graphql.language.*
import graphql.scalars.`object`.ObjectScalar
import graphql.schema.*

/**
 * GraphQL Coercing which maps JSON objects from / to [JsonNode]
 *
 * @param objectMapper used for object parsing
 */
class JSONCoercing(private val objectMapper: ObjectMapper) : Coercing<JsonNode, JsonNode> {

    override fun serialize(dataFetcherResult: Any): JsonNode {
        if (dataFetcherResult !is JsonNode) {
            throw CoercingSerializeException("Only JSONNodes can be serialized")
        }
        return dataFetcherResult
    }

    override fun parseValue(input: Any): JsonNode {
        try {
            return objectMapper.valueToTree(input)
        } catch (e: Exception) {
            throw CoercingParseValueException(e)
        }
    }

    override fun parseLiteral(input: Any): JsonNode {
        return parseLiteral(input, emptyMap())
    }

    override fun parseLiteral(input: Any, variables: Map<String, Any>): JsonNode {
        return when (input) {
            is NullValue -> JsonNodeFactory.instance.nullNode()
            is FloatValue -> JsonNodeFactory.instance.numberNode(input.value)
            is StringValue -> JsonNodeFactory.instance.textNode(input.value)
            is IntValue -> JsonNodeFactory.instance.numberNode(input.value)
            is BooleanValue -> JsonNodeFactory.instance.booleanNode(input.isValue)
            is EnumValue -> JsonNodeFactory.instance.textNode(input.name)
            is VariableReference -> parseValue(variables[input.name] ?: input.name)
            is ArrayValue -> JsonNodeFactory.instance.arrayNode().also { arrayNode ->
                arrayNode.addAll(input.values.map { parseLiteral(it, variables) })
            }
            is ObjectValue -> JsonNodeFactory.instance.objectNode().also { objectNode ->
                objectNode.setAll<JsonNode>(input.objectFields.associate {
                    it.name to parseLiteral(it.value, variables)
                })
            }
            else -> throw CoercingParseLiteralException("Cannot handle literal $input")
        }
    }

    override fun valueToLiteral(input: Any): Value<out Value<*>> {
        return ObjectScalar.INSTANCE.coercing.valueToLiteral(input)
    }
}
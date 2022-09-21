package gropius.util

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import org.springframework.stereotype.Component

/**
 * Helper to deterministically map [JsonNode] to [String]
 */
@Component
class JsonNodeMapper {

    /**
     * Used [ObjectMapper]
     */
    private val objectMapper = ObjectMapper().configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true)

    /**
     * Helper which converts a [JsonNode] to a deterministic [String]
     *
     * @param jsonNode to convert
     * @return the conversion result
     */
    fun jsonNodeToDeterministicString(jsonNode: JsonNode): String {
        val value = objectMapper.treeToValue(jsonNode, Object::class.java)
        return objectMapper.writeValueAsString(value)
    }

}
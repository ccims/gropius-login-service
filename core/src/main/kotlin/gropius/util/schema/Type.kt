package gropius.util.schema

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * Type represents the values the `type` keyword can take in JTD.
 */
enum class Type {
    /**
     * The `boolean` type.
     */
    @JsonProperty("boolean")
    BOOLEAN,

    /**
     * The `float32` type.
     */
    @JsonProperty("float32")
    FLOAT32,

    /**
     * The `float64` type.
     */
    @JsonProperty("float64")
    FLOAT64,

    /**
     * The `int8` type.
     */
    @JsonProperty("int8")
    INT8,

    /**
     * The `uint8` type.
     */
    @JsonProperty("uint8")
    UINT8,

    /**
     * The `int16` type.
     */
    @JsonProperty("int16")
    INT16,

    /**
     * The `uint16` type.
     */
    @JsonProperty("uint16")
    UINT16,

    /**
     * The `int32` type.
     */
    @JsonProperty("int32")
    INT32,

    /**
     * The `uint32` type.
     */
    @JsonProperty("uint32")
    UINT32,

    /**
     * The `string` type.
     */
    @JsonProperty("string")
    STRING,

    /**
     * The `timestamp` type.
     */
    @JsonProperty("timestamp")
    TIMESTAMP,
}

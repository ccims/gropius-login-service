package gropius.util.schema

/**
 * Form represents the eight forms a JTD schema may take on.
 */
enum class Form {
    /**
     * The ref form.
     *
     * The `ref` keyword is used.
     */
    REF,

    /**
     * The type form.
     *
     * The `type` keyword is used.
     */
    TYPE,

    /**
     * The enum form.
     *
     * The `enum` keyword is used.
     */
    ENUM,

    /**
     * The elements form.
     *
     * The `elements` keyword is used.
     */
    ELEMENTS,

    /**
     * The properties form.
     *
     * One or both of `properties` and `optionalProperties` is used,
     * and `additionalProperites` may be used.
     */
    PROPERTIES,

    /**
     * The values form.
     *
     * The `values` keyword is used.
     */
    VALUES,

    /**
     * The discriminator form.
     *
     * Both the `discriminator` and `mapping` keywords are used.
     */
    DISCRIMINATOR,
}
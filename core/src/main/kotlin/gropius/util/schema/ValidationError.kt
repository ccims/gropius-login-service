package gropius.util.schema

/**
 * Represents a single validation problem, typically returned from
 * `verify` in `Validator`.
 *
 * Note well that this class is not an `Exception`. It is a plain old Java
 * object.
 *
 * @property instancePath the path to the instance that failed validation
 * @property schemaPath the path to the schema that failed validation
 */
class ValidationError(
    val instancePath: List<String>,
    val schemaPath: List<String>,
) {

    val message get() = "Validation failed at ${instancePath.joinToString(separator = "/")}"

}
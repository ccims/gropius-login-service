package gropius.util.schema

/**
 * The exception raised from `verify` on `Schema` if a schema is
 * invalid.
 */
class InvalidSchemaException(msg: String?) : Exception(msg)
package gropius.graphql

/**
 * Wrapper for the result of a mutation when using [AutoPayloadType]
 *
 * @param payload the result of the mutation
 */
class PayloadWrapper(
    val payload: Any?
)
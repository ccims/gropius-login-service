package gropius.dto.payload

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID

/**
 * Payload type for delete node mutations
 */
class DeleteNodePayload(@GraphQLDescription("The id of the deleted Node") val id: ID)
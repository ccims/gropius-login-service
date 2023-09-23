package gropius.dto.payload

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.architecture.ComponentVersion
import gropius.model.architecture.Project

/**
 * Payload type for the addComponentVersionToProject mutation
 */
@GraphQLDescription("Payload type for the addComponentVersionToProject mutation")
class AddComponentVersionToProjectPayload(
    @GraphQLDescription("The updated project")
    val project: Project,
    @GraphQLDescription("The added component version")
    val componentVersion: ComponentVersion
)
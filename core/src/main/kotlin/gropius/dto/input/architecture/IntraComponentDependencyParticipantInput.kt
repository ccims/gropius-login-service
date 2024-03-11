package gropius.dto.input.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.execution.OptionalInput
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input to create a IntraComponentDependencyParticipant")
class IntraComponentDependencyParticipantInput(
    @GraphQLDescription(
        """The id of the Interface, must be an Interface on the ComponentVersion the
        IntraComponentDependencySpecification this is part of refers to
        """
    )
    val `interface`: ID,
    @GraphQLDescription(
        "The ids of includedParts, must all be activeParts on the InterfaceSpecificationVersion associated with `interface`"
    )
    val includedParts: OptionalInput<List<ID>>
) : Input()
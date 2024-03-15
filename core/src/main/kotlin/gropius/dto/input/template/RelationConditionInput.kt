package gropius.dto.input.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.common.Input

@GraphQLDescription("Input to create a RelationCondition")
class RelationConditionInput(
    @GraphQLDescription("Defines which InterfaceSpecifications are derived via the relation")
    val interfaceSpecificationDerivationConditions: List<InterfaceSpecificationDerivationConditionInput>,
    @GraphQLDescription("IDs of Templates of allowed start RelationPartners")
    val from: List<ID>,
    @GraphQLDescription("IDs of Templates of allowed end RelationPartners")
    val to: List<ID>
) : Input() {

    override fun validate() {
        super.validate()
        interfaceSpecificationDerivationConditions.forEach { it.validate() }
    }
}
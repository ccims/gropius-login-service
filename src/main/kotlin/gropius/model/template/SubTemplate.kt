package gropius.model.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import io.github.graphglue.model.Direction
import io.github.graphglue.model.DomainNode
import io.github.graphglue.model.Node
import io.github.graphglue.model.NodeRelationship
import org.springframework.data.annotation.Transient

@DomainNode
@GraphQLDescription(
    """BaseTemplate which is part of a Template.
    Defines templated fields with specific types (defined using JSON schema).
    Does not provide any composition features, as composition is handled by the Template it is part of.
    """
)
abstract class SubTemplate<T : Node, P : Template<*, *>, S : SubTemplate<T, P, S>>(
    name: String, description: String, templateFieldSpecifications: MutableMap<String, String>
) : BaseTemplate<T, S>(name, description, templateFieldSpecifications) {

    companion object {
        const val PART_OF = "PART_OF"
    }

    @NodeRelationship(PART_OF, Direction.OUTGOING)
    @GraphQLDescription("The Template this SubTemplate is part of")
    @delegate:Transient
    val partOf by NodeProperty<P>()

}
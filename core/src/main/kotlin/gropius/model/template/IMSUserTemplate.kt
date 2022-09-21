package gropius.model.template

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.architecture.Interface
import io.github.graphglue.model.DomainNode

@DomainNode
@GraphQLDescription(
    """SubTemplate for IMSUser.
    Part of an IMSTemplate.
    Defines templated fields with specific types (defined using JSON schema).
    """
)
class IMSUserTemplate(
    name: String, description: String, templateFieldSpecifications: MutableMap<String, String>
) : SubTemplate<Interface, InterfaceSpecificationTemplate, InterfaceTemplate>(
    name, description, templateFieldSpecifications
)
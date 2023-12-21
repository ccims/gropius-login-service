package gropius.service.template

import gropius.authorization.GropiusAuthorizationContext
import gropius.dto.input.ifPresent
import gropius.dto.input.orElse
import gropius.dto.input.template.CreateRelationTemplateInput
import gropius.dto.input.template.RelationConditionInput
import gropius.model.template.*
import gropius.model.template.style.StrokeStyle
import gropius.repository.findAllById
import gropius.repository.template.InterfaceSpecificationTemplateRepository
import gropius.repository.template.RelationPartnerTemplateRepository
import gropius.repository.template.RelationTemplateRepository
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Service

/**
 * Service for [RelationTemplate]s. Provides functions to create, update and delete
 *
 * @param repository the associated repository used for CRUD functionality
 * @param relationPartnerTemplateRepository used to get [RelationPartnerTemplate]s by id
 * @param interfaceSpecificationTemplateRepository used to get [InterfaceSpecificationTemplate]s by id
 */
@Service
class RelationTemplateService(
    repository: RelationTemplateRepository,
    private val relationPartnerTemplateRepository: RelationPartnerTemplateRepository,
    private val interfaceSpecificationTemplateRepository: InterfaceSpecificationTemplateRepository
) : AbstractTemplateService<RelationTemplate, RelationTemplateRepository>(repository) {

    /**
     * Creates a new [RelationTemplate] based on the provided [input]
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the [RelationTemplate]
     * @return the saved created [RelationTemplate]
     */
    suspend fun createRelationTemplate(
        authorizationContext: GropiusAuthorizationContext, input: CreateRelationTemplateInput
    ): RelationTemplate {
        input.validate()
        checkCreateTemplatePermission(authorizationContext)
        val template = RelationTemplate(input.name, input.description, mutableMapOf(), false, input.markerType)
        input.stroke.ifPresent {
            template.stroke().value = StrokeStyle(it.color.orElse(null), it.dash.orElse(null))
        }
        createdTemplate(template, input)
        template.relationConditions() += input.relationConditions.map {
            createRelationCondition(it)
        }
        template.relationConditions() += template.extends().flatMap { it.relationConditions() }
        return repository.save(template).awaitSingle()
    }

    /**
     * Creates a new [RelationCondition] based on [input]
     * Does not check permission or save the created [RelationCondition]
     *
     * @param input defines the created [RelationCondition]
     * @return the created [RelationCondition]
     */
    private suspend fun createRelationCondition(
        input: RelationConditionInput
    ): RelationCondition {
        val relationCondition = RelationCondition()
        relationCondition.interfaceSpecificationDerivationConditions() += input.interfaceSpecificationDerivationConditions.map {
            val condition = InterfaceSpecificationDerivationCondition(
                it.derivesVisibleSelfDefined,
                it.derivesInvisibleSelfDefined,
                it.derivesVisibleDerived,
                it.derivesInvisibleDerived,
                it.isVisibleDerived,
                it.isInvisibleDerived
            )
            condition.derivableInterfaceSpecifications() += interfaceSpecificationTemplateRepository.findAllById(it.derivableInterfaceSpecifications)
            condition
        }
        relationCondition.from() += relationPartnerTemplateRepository.findAllById(input.from)
        relationCondition.to() += relationPartnerTemplateRepository.findAllById(input.to)
        return relationCondition
    }

}
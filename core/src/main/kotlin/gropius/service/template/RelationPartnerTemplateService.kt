package gropius.service.template

import gropius.model.template.RelationPartnerTemplate
import gropius.repository.template.RelationPartnerTemplateRepository
import org.springframework.stereotype.Service

/**
 * Service for [RelationPartnerTemplate]s.
 *
 * @param repository the associated repository used for CRUD functionality
 */
@Service
class RelationPartnerTemplateService(
    repository: RelationPartnerTemplateRepository
) : BaseTemplateService<RelationPartnerTemplate<*,*>, RelationPartnerTemplateRepository>(repository)
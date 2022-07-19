package gropius.repository.template

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.stereotype.Repository
import gropius.model.template.ComponentVersionTemplate

/**
 * Repository for [ComponentVersionTemplate]
 */
@Repository
interface ComponentVersionTemplateRepository : ReactiveNeo4jRepository<ComponentVersionTemplate, String>
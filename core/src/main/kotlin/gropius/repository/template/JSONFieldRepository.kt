package gropius.repository.template

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.stereotype.Repository
import gropius.model.template.JSONField

/**
 * Repository for [JSONField]
 */
@Repository
interface JSONFieldRepository : ReactiveNeo4jRepository<JSONField, String>
package gropius.repository.issue.timeline

import gropius.model.issue.timeline.RelationTypeChangedEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [RelationTypeChangedEvent]
 */
@Repository
interface RelationTypeChangedEventRepository : GropiusRepository<RelationTypeChangedEvent, String>
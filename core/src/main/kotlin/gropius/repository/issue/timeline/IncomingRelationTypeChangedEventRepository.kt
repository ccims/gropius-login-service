package gropius.repository.issue.timeline

import gropius.model.issue.timeline.IncomingRelationTypeChangedEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [IncomingRelationTypeChangedEvent]
 */
@Repository
interface IncomingRelationTypeChangedEventRepository : GropiusRepository<IncomingRelationTypeChangedEvent, String>
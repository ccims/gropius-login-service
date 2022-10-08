package gropius.repository.issue.timeline

import gropius.model.issue.timeline.OutgoingRelationTypeChangedEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [OutgoingRelationTypeChangedEvent]
 */
@Repository
interface OutgoingRelationTypeChangedEventRepository : GropiusRepository<OutgoingRelationTypeChangedEvent, String>
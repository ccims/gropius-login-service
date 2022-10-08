package gropius.repository.issue.timeline

import gropius.model.issue.timeline.AbstractTypeChangedEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [AbstractTypeChangedEvent]
 */
@Repository
interface AbstractTypeChangedEventRepository : GropiusRepository<AbstractTypeChangedEvent<*>, String>
package gropius.repository.issue.timeline

import gropius.model.issue.timeline.TemplatedFieldChangedEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [TemplatedFieldChangedEvent]
 */
@Repository
interface TemplatedFieldChangedEventRepository : GropiusRepository<TemplatedFieldChangedEvent, String>
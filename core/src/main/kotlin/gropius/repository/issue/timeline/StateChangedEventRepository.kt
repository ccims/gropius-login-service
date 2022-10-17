package gropius.repository.issue.timeline

import gropius.model.issue.timeline.StateChangedEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [StateChangedEvent]
 */
@Repository
interface StateChangedEventRepository : GropiusRepository<StateChangedEvent, String>
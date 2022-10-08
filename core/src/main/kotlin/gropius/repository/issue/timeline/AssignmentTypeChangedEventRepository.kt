package gropius.repository.issue.timeline

import gropius.model.issue.timeline.AssignmentTypeChangedEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [AssignmentTypeChangedEvent]
 */
@Repository
interface AssignmentTypeChangedEventRepository : GropiusRepository<AssignmentTypeChangedEvent, String>
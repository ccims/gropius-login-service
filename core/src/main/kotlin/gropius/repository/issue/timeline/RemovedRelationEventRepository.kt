package gropius.repository.issue.timeline

import gropius.model.issue.timeline.RemovedRelationEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [RemovedRelationEvent]
 */
@Repository
interface RemovedRelationEventRepository : GropiusRepository<RemovedRelationEvent, String>
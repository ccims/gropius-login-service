package gropius.repository.issue.timeline

import gropius.model.issue.timeline.RemovedTemplatedFieldEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [RemovedTemplatedFieldEvent]
 */
@Repository
interface RemovedTemplatedFieldEventRepository : GropiusRepository<RemovedTemplatedFieldEvent, String>
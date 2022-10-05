package gropius.repository.issue.timeline

import gropius.model.issue.timeline.ParentTimelineItem
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [ParentTimelineItem]
 */
@Repository
interface ParentTimelineItemRepository : GropiusRepository<ParentTimelineItem, String>
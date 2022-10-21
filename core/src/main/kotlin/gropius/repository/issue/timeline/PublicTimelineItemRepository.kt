package gropius.repository.issue.timeline

import gropius.model.issue.timeline.TimelineItem
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [TimelineItem]
 */
@Repository
interface PublicTimelineItemRepository : GropiusRepository<TimelineItem, String>
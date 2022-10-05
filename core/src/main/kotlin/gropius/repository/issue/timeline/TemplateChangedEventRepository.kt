package gropius.repository.issue.timeline

import gropius.model.issue.timeline.TemplateChangedEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [TemplateChangedEvent]
 */
@Repository
interface TemplateChangedEventRepository : GropiusRepository<TemplateChangedEvent, String>
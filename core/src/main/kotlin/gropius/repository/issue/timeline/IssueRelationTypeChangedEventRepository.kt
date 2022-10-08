package gropius.repository.issue.timeline

import gropius.model.issue.timeline.IssueRelationTypeChangedEvent
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [IssueRelationTypeChangedEvent]
 */
@Repository
interface IssueRelationTypeChangedEventRepository : GropiusRepository<IssueRelationTypeChangedEvent, String>
package gropius.repository.template

import gropius.model.template.IssueState
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [IssueState]
 */
@Repository
interface IssueStateRepository : GropiusRepository<IssueState, String>
package gropius.repository.issue.timeline

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.stereotype.Repository
import gropius.model.issue.timeline.IssueComment

/**
 * Repository for [IssueComment]
 */
@Repository
interface IssueCommentRepository : ReactiveNeo4jRepository<IssueComment, String>
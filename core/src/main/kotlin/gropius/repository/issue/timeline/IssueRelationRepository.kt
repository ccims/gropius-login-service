package gropius.repository.issue.timeline

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.stereotype.Repository
import gropius.model.issue.timeline.IssueRelation

/**
 * Repository for [IssueRelation]
 */
@Repository
interface IssueRelationRepository : ReactiveNeo4jRepository<IssueRelation, String>
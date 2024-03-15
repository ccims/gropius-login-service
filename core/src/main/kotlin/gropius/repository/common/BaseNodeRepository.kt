package gropius.repository.common

import gropius.model.common.BaseNode
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [BaseNode]
 */
@Repository
interface BaseNodeRepository : GropiusRepository<BaseNode, String>
package gropius.repository.architecture

import gropius.model.architecture.SyncPermissionTarget
import gropius.repository.GropiusRepository
import org.springframework.stereotype.Repository

/**
 * Repository for [SyncPermissionTarget]
 */
@Repository
interface SyncPermissionTargetRepository : GropiusRepository<SyncPermissionTarget, String>